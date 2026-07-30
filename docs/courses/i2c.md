---
title: 08 · I²C 传感器通信
---

# 08 · I²C 传感器通信

<div class="lesson-progress" data-lesson-id="i2c-001" data-lesson-title="I²C 传感器通信"></div>

## 学习目标

- 解释 SDA、SCL、起始、地址、读写位、应答和停止条件；
- 正确处理 7 位地址与 HAL 参数的表示方式；
- 读取一个设备身份寄存器；
- 使用逻辑分析仪区分无应答、超时和数据解释错误。

## 总线基础

I²C 使用开漏输出，因此 SDA 和 SCL 通常都需要上拉电阻。主机产生时钟并发送目标地址，从机用 ACK/NACK 表示是否响应。

!!! warning "先确认电平"
    确认传感器与 MCU 的供电电压、逻辑电平和共地。不要因为模块标有 `VCC` 就默认其数据线可以直接连接 5 V。

## 地址最容易混淆

器件手册通常给出 7 位地址，例如 `0x68`。部分 STM32 HAL 接口要求把 7 位地址左移一位：

```c
#define SENSOR_ADDR_7BIT 0x68U
#define SENSOR_ADDR_HAL  (SENSOR_ADDR_7BIT << 1U)
```

不要同时使用已经包含读写位的 8 位地址再左移。使用前应核对当前 HAL 函数说明和逻辑分析仪上的地址字节。

## CubeMX 配置

1. 选择一个 I²C 实例；
2. 确认 SDA/SCL 的复用引脚与板卡连线一致；
3. 从标准模式开始，不急于提高总线速度；
4. 确认板上或模块上存在合适的上拉电阻；
5. 为错误和超时预留日志通道。

## 读取身份寄存器

```c
HAL_StatusTypeDef sensor_read_id(uint8_t *value)
{
    const uint8_t who_am_i_reg = 0x75U; /* 替换为器件手册中的地址 */

    return HAL_I2C_Mem_Read(
        &hi2c1,
        SENSOR_ADDR_HAL,
        who_am_i_reg,
        I2C_MEMADD_SIZE_8BIT,
        value,
        1U,
        100U);
}
```

先读取固定的身份寄存器，比直接读取温度、姿态等业务数据更容易判断通信层是否正常。

## 一次事务应该看到什么

逻辑分析仪中应看到：

```text
START → 地址+写 → ACK → 寄存器地址 → ACK
      → RESTART → 地址+读 → ACK → 数据 → NACK → STOP
```

若在地址后立即 NACK，优先检查地址、供电、连线和上拉；若地址应答但数据错误，再检查寄存器地址、字节序和初始化顺序。

## 超时与总线恢复

设备复位或主机中途重启时，SDA 可能被从机保持为低。可靠系统不能无限阻塞：

- 每次事务都有明确超时；
- 记录 HAL 状态和错误码；
- 必要时重新初始化外设；
- 对产品级恢复流程，应依据目标器件要求谨慎产生恢复时钟并重新探测设备。

## 验收方法

- 上电后稳定读出身份寄存器；
- 拔掉传感器时在超时内返回错误，主循环仍继续运行；
- 接回设备后可以通过明确的重新初始化流程恢复；
- 逻辑分析仪的地址、ACK 和数据与程序日志一致。

## 常见问题

??? question "设备一直 NACK"
    检查 7 位地址是否被错误左移两次、地址选择脚状态、SDA/SCL 是否接反、是否共地以及总线是否有上拉。

??? question "扫描得到地址，但读取寄存器失败"
    地址应答只说明设备存在。继续核对寄存器地址宽度、读写时序、启动等待时间和器件是否需要先退出复位或休眠。

??? question "总线偶尔卡死"
    查看是否存在电源时序、接触不良、超时后未清状态或中断/DMA 并发访问。不要在多个上下文中无保护地同时使用同一个 I²C 句柄。

## 练习

- 故意使用错误地址并记录波形差异；
- 把超时时间调得很短，观察错误路径；
- 为传感器驱动设计 `init/read/recover` 三个明确接口。

## 官方资料与核对路径

| 文档 | 建议核对内容 |
|---|---|
| [RM0008 · STM32F1 Reference Manual](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf) | `Inter-integrated circuit interface (I2C)`、地址、状态标志和错误处理 |
| [DS5319 · STM32F103x8/xB Data Sheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf) | SDA/SCL 引脚复用、输入输出电气特性和 I²C 时序 |
| [ES096 · STM32F103x8/xB Errata](https://www.st.com/resource/en/errata_sheet/es096-stm32f101x8b-stm32f102x8b-and-stm32f103x8b-mediumdensity-device-limitations-stmicroelectronics.pdf) | I²C 已知限制及对应规避方法 |
| [STM32CubeF1 官方仓库](https://github.com/STMicroelectronics/STM32CubeF1) | 在 `Projects/.../Examples/I2C` 中核对 HAL 使用方式 |

器件地址、上电等待和寄存器定义必须再查传感器自己的官方 Data Sheet。

## 下一步

[使用 SPI 连接外部器件 →](spi.md)

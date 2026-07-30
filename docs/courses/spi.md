---
title: 09 · SPI 与外部器件
---

# 09 · SPI 与外部器件

<div class="lesson-progress" data-lesson-id="spi-001" data-lesson-title="SPI 与外部器件"></div>

## 学习目标

- 解释 SCK、MOSI、MISO、CS 和全双工传输；
- 根据器件手册配置 CPOL、CPHA、位序和最高时钟；
- 完成一次带片选控制的寄存器读取；
- 使用逻辑分析仪定位模式错误、片选错误和字节序问题。

## SPI 没有统一的设备协议

SPI 只规定同步移位方式。命令格式、读写位、地址长度、空闲字节和片选时序都由外部器件定义。必须同时阅读 MCU 的 SPI 章节和目标器件的数据手册。

常见信号：

| 信号 | 作用 |
|---|---|
| SCK | 主机产生的时钟 |
| MOSI | 主机发给从机 |
| MISO | 从机发给主机 |
| CS/NSS | 选择具体器件，常为低有效 |

## 四种时钟模式

CPOL 决定空闲电平，CPHA 决定在哪个边沿采样。模式不一致时，数据可能整体移位、只在某些频率下偶尔正确，或始终读到 `0x00/0xFF`。

第一次通信应：

1. 使用器件手册指定的模式；
2. 从较低时钟频率开始；
3. 使用 MSB first，除非手册明确要求相反；
4. 用软件 GPIO 控制片选，先把事务边界做清楚。

## 最小寄存器读取

下面示例只展示事务结构，命令格式必须替换为目标器件要求：

```c
HAL_StatusTypeDef spi_read_register(
    uint8_t command,
    uint8_t *value)
{
    HAL_StatusTypeDef status;

    HAL_GPIO_WritePin(DEVICE_CS_GPIO_Port, DEVICE_CS_Pin, GPIO_PIN_RESET);
    status = HAL_SPI_Transmit(&hspi1, &command, 1U, 100U);

    if (status == HAL_OK) {
        status = HAL_SPI_Receive(&hspi1, value, 1U, 100U);
    }

    HAL_GPIO_WritePin(DEVICE_CS_GPIO_Port, DEVICE_CS_Pin, GPIO_PIN_SET);
    return status;
}
```

有些器件要求发送地址后再发送一个 dummy byte 才返回数据；全双工 SPI 中，每接收一个字节也必须同时发送一个字节。

## 用逻辑分析仪验证

一次正确事务至少应回答：

- CS 是否在整个命令和数据阶段保持有效；
- 时钟空闲电平与采样边沿是否正确；
- MOSI 命令是否与代码一致；
- MISO 是否在预期字节开始返回；
- 时钟频率是否超过器件在当前电压下的限制。

## DMA 什么时候有意义

读取一个身份寄存器时，阻塞调用更容易调试。连续采集、屏幕刷新或大块 Flash 传输时，DMA 才能明显降低 CPU 占用。引入 DMA 后必须明确：

- 片选何时拉低和释放；
- 缓冲区何时可以修改；
- 完成回调如何通知业务层；
- 超时后如何终止并恢复事务。

## 验收方法

- 连续读取固定身份寄存器 1000 次结果一致；
- 故意改错 CPHA 后能从波形解释错误；
- 拔掉器件时程序能返回明确错误，不永久阻塞；
- 将时钟逐级提高并记录可靠工作的上限，而不是直接使用最高配置。

## 常见问题

??? question "总是读到 0xFF"
    常见原因是 MISO 未被器件驱动、CS 无效、器件未供电或接线错误。先看波形，不要立即怀疑 HAL。

??? question "低速正确，高速错误"
    检查器件最高时钟、供电电压、走线、面包板和采样边沿。提高 GPIO 速度不一定能解决问题，还可能增加干扰。

??? question "第一次正确，后面错位"
    检查每次事务是否完整释放片选、错误路径是否遗漏清理，以及命令/数据长度是否与器件要求一致。

## 练习

- 读取一个 SPI 器件的身份寄存器并保存波形截图；
- 把事务封装成带超时和错误码的驱动接口；
- 比较阻塞、中断和 DMA 三种方式的适用场景。

## 官方资料与核对路径

| 文档 | 建议核对内容 |
|---|---|
| [RM0008 · STM32F1 Reference Manual](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf) | `Serial peripheral interface (SPI)`、CPOL、CPHA、NSS、状态和错误标志 |
| [DS5319 · STM32F103x8/xB Data Sheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf) | SPI 引脚复用、最高时钟和时序图 |
| [ES096 · STM32F103x8/xB Errata](https://www.st.com/resource/en/errata_sheet/es096-stm32f101x8b-stm32f102x8b-and-stm32f103x8b-mediumdensity-device-limitations-stmicroelectronics.pdf) | SPI/I²S 已知限制与规避方法 |
| [STM32CubeF1 官方仓库](https://github.com/STMicroelectronics/STM32CubeF1) | 在 `Projects/.../Examples/SPI` 中核对官方示例 |

命令格式、dummy byte、CS 时序和最高频率以外部器件自己的官方 Data Sheet 为准。

## 下一步

[进入项目实战：LED 与按键控制器 →](../projects/led-button.md)

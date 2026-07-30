---
title: STM32F103C8T6 常见问题与解决方案
---

# STM32F103C8T6 常见问题与解决方案

**发布日期：2026 年 7 月 30 日**  
**适用对象：STM32F103C8T6、常见最小系统板和使用 ST-LINK 的初学者**

STM32F103C8T6 的大多数“玄学问题”其实可以归到四类：供电和接线、时钟、外设配置、软件目标型号。不要一上来重装软件或大改代码，先从可测量的现象开始。

!!! tip "推荐的排查顺序"
    供电与共地 → SWD/串口接线 → BOOT 与复位 → 工程目标型号 → 时钟 → 外设参数 → 芯片勘误。

## 1. ST-LINK 提示找不到目标芯片

**常见表现**

- `No target found`
- 下载到一半断开
- 之前可以连接，烧录某个程序后再也连不上

**按顺序检查**

1. 用万用表确认板上 3.3 V 稳定，ST-LINK 与目标板必须共地。
2. 核对 `SWDIO`、`SWCLK`、`GND` 和 `3.3V`，不要把 SWDIO 与 SWCLK 接反。
3. 把下载速度降到 100–400 kHz，排除长杜邦线、接触不良和信号质量问题。
4. 在 STM32CubeProgrammer 或 IDE 中选择 **Connect under reset**，按住复位再连接。
5. 如果程序把 SWD 引脚改成普通 GPIO、频繁进入低功耗或立即触发复位，先擦除芯片，再修正程序。

连接恢复后，不要急着恢复原代码。先烧录一个只有系统时钟和 LED 的最小工程，确认硬件与调试链路稳定。

## 2. 下载成功，但程序没有运行

**先看三个位置**

- `BOOT0`：正常从用户 Flash 启动时应为低电平。
- `NRST`：不应被外部电路持续拉低。
- 启动文件与链接脚本：工程必须选择准确的 `STM32F103C8Tx` 目标。

如果使用外部高速晶振，还要确认板上晶振频率与 CubeMX 配置一致。外部晶振不起振时，等待 HSE 的程序可能停在时钟初始化阶段。排查时可先改用内部 HSI，确认主程序是否能够运行。

## 3. GPIO 或 LED 没反应、亮灭逻辑相反

很多开发板的 LED 是“低电平点亮”：GPIO 输出低电平时电流流过 LED。因此代码没有错，观察到的逻辑也可能与直觉相反。

**检查清单**

- 已打开对应 GPIO 端口的 APB2 时钟。
- STM32F1 使用 `CRL/CRH` 配置引脚，不要直接套用其他系列基于 `MODER` 的寄存器代码。
- 引脚没有被 JTAG、调试口或其他复用功能占用。
- 推挽输出、开漏输出、上拉输入等模式与外部电路匹配。
- 查开发板原理图确认 LED、按键和接口的真实连接，而不是只看丝印。

可以用示波器或万用表直接测引脚电平。如果寄存器和引脚电平正确而 LED 不亮，问题更可能在板卡接线或 LED 极性。

## 4. 串口输出乱码

乱码通常不是“串口坏了”，而是收发两端对时间和格式的理解不一致。

**优先核对**

1. 串口工具与程序的波特率一致，例如都为 115200。
2. 数据位、停止位、奇偶校验一致，常见配置为 `8-N-1`。
3. USB-TTL 模块使用 3.3 V 逻辑电平，并且与板卡共地。
4. MCU 的 TX 接模块 RX，MCU 的 RX 接模块 TX。
5. 系统时钟和 APB 时钟与代码假设一致。

如果乱码呈现固定规律，先测量实际波特率。系统时钟配置错误会让所有波特率一起偏离；只偶发丢字则更像缓冲区、阻塞发送或中断优先级问题。

## 5. ADC 数值抖动或明显不准

软件平均只能降低随机噪声，不能修复供电、采样时间或参考电压造成的系统误差。

**有效做法**

- 保证 `VDDA/VSSA` 的连接和去耦正确。
- 上电后执行 ADC 校准，再开始正式采样。
- 对高阻信号源增加采样时间，必要时使用运放缓冲。
- 避免在大电流 GPIO 翻转、PWM 边沿附近立即采样。
- 用已知稳定电压检查满量程与线性，再考虑移动平均或中值滤波。

ST 的 AN2834 专门讨论 ADC 精度，包括电源、PCB、源阻抗、采样时间和校准。遇到“平均后仍然偏低/偏高”，应优先对照这份文档。

## 6. I²C 无应答或总线被拉死

**常见原因**

- SDA、SCL 没有上拉电阻。
- 传感器地址是 7 位地址，但调用的库要求左移后的地址，或者反过来。
- 供电电压不匹配、没有共地或引脚复用错误。
- 上一次通信中途复位，外设仍保持 SDA 为低。
- 没有超时机制，程序永久等待标志位。

先用逻辑分析仪确认是否出现起始条件、地址和 ACK。若 SDA 持续为低，可在重新初始化前把 SCL 临时配置成 GPIO，输出最多 9 个时钟脉冲，再产生停止条件；同时必须设置软件超时，避免整机被单个外设拖死。

STM32F1 的 I²C 外设存在需要注意的限制和处理条件。具体项目应对照 **ES096 勘误表** 的 I²C 条目，而不是只看通用教程。

## 7. PWM 频率与计算值相差一倍

定时器输入时钟不一定等于 APB 总线时钟。当 APB 预分频器不为 1 时，很多 STM32F1 定时器的时钟会变为对应 APB 时钟的 2 倍。

常用计算为：

```text
PWM 频率 = 定时器时钟 / ((PSC + 1) × (ARR + 1))
占空比 ≈ CCR / (ARR + 1)
```

排查时不要只看 CubeMX 中的系统时钟。应沿着时钟树确认 APB1/APB2 预分频和目标定时器的实际输入时钟，再检查 `PSC`、`ARR` 的“加一”关系。

## 8. 程序变大后下载失败或运行异常

ST 官方数据手册给出的 STM32F103C8T6 Flash 容量为 64 KB、SRAM 为 20 KB。市面上的某些板卡或芯片可能表现出不同容量，但工程设计不能依赖未被官方规格保证的空间。

**解决方法**

- 工程目标选择 `STM32F103C8Tx`，检查链接器输出的 Flash/RAM 使用量。
- 不要仅因为“某块板能烧进去”就把链接脚本改成更大的容量。
- 大数组优先检查是否占用 SRAM；字符串、查找表可按编译器规则放到只读区。
- 打开链接映射文件，查明真正占空间的模块。

## 一张表完成快速定位

| 现象 | 第一检查点 | 推荐工具 |
|---|---|---|
| 找不到芯片 | 3.3 V、共地、SWD 接线 | 万用表、STM32CubeProgrammer |
| 下载成功不运行 | BOOT0、NRST、时钟初始化 | 调试器、示波器 |
| LED 不亮 | 原理图、GPIO 模式、有效电平 | 万用表 |
| 串口乱码 | 实际波特率、共地、8-N-1 | 逻辑分析仪 |
| ADC 抖动 | VDDA、采样时间、源阻抗 | 稳压源、示波器 |
| I²C 无应答 | 地址、上拉、ACK | 逻辑分析仪 |
| PWM 频率错误 | 定时器真实时钟、PSC/ARR | 示波器 |
| 程序过大 | Flash/SRAM 使用量 | map 文件 |

## 官方资料与核对路径

| 文档 | 解决什么问题 |
|---|---|
| [DS5319：STM32F103x8/xB 数据手册](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf) | 引脚、电气参数、存储容量、封装 |
| [RM0008：STM32F1 参考手册](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf) | RCC、GPIO、USART、ADC、I²C、TIM 等寄存器与工作流程 |
| [ES096：STM32F101x8/B、F102x8/B、F103x8/B 勘误表](https://www.st.com/resource/en/errata_sheet/es096-stm32f101x8b-stm32f102x8b-and-stm32f103x8b-mediumdensity-device-limitations-stmicroelectronics.pdf) | 芯片已知限制及规避方法 |
| [PM0056：Cortex-M3 编程手册](https://www.st.com/resource/en/programming_manual/cd00228163-stm32f10xxx20xxx21xxxl1xxxx-cortexm3-programming-manual-stmicroelectronics.pdf) | 内核、异常、中断和调试 |
| [UM2576：STM32CubeIDE ST-LINK GDB Server](https://www.st.com/resource/en/user_manual/dm00613038-stm32cubeide-st-link-gdb-server-stmicroelectronics.pdf) | 调试连接、复位模式与服务器配置 |
| [AN4899：STM32 GPIO 配置](https://www.st.com/resource/en/application_note/dm00315319-stm32-gpio-configuration-for-hardware-settings-and-low-power-consumption-stmicroelectronics.pdf) | GPIO 电气行为与低功耗配置 |
| [AN2834：提高 STM32 ADC 精度](https://www.st.com/resource/en/application_note/an2834-how-to-optimize-the-adc-accuracy-in-the-stm32-mcus-stmicroelectronics.pdf) | ADC 误差来源与优化 |
| [AN4776：STM32 通用定时器实践](https://www.st.com/resource/en/application_note/an4776-generalpurpose-timer-cookbook-for-stm32-microcontrollers-stmicroelectronics.pdf) | 定时器时钟、PWM 和典型应用 |

本站还整理了可按故障类型查找的 [F103C8T6 官方资料索引](../resources/f103-official-docs.md)。


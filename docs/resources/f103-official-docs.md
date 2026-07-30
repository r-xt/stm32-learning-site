# STM32F103C8T6 官方资料索引

本页把课程使用的资料集中到一个可核对入口。默认教学基线是 **STM32F103C8T6**；如果你使用其他型号，先从对应产品页重新下载 Data Sheet、Reference Manual 和 Errata，不要直接照搬 F103 的寄存器、引脚或电气参数。

资料核验日期：**2026-07-30**。ST 可能更新文档修订版，点击链接后仍应检查 PDF 首页的文档编号与 Revision。

## 四份必查文档

| 优先级 | 文档 | 用途 | 课程中重点核对 |
|---:|---|---|---|
| 1 | [STM32F103C8 产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html) | 芯片状态、最新资料总入口 | 开始任何新工程前确认完整型号 |
| 2 | [DS5319 · STM32F103x8/xB Data Sheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf) | 引脚、封装、复用功能、电气极限与时序 | GPIO、ADC、I²C、SPI 接线和最高参数 |
| 3 | [RM0008 · STM32F1 Reference Manual](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf) | RCC、GPIO、EXTI、DMA 和全部外设的工作方式与寄存器 | 所有外设配置与故障定位 |
| 4 | [ES096 · STM32F103x8/xB Errata](https://www.st.com/resource/en/errata_sheet/es096-stm32f101x8b-stm32f102x8b-and-stm32f103x8b-mediumdensity-device-limitations-stmicroelectronics.pdf) | 已知芯片限制与规避方法 | 行为与手册不一致时优先检查 |

另请保存 [PM0056 · Cortex-M3 Programming Manual](https://www.st.com/resource/en/programming_manual/cd00228163-stm32f10xxx20xxx21xxxl1xxxx-cortexm3-programming-manual-stmicroelectronics.pdf)，用于核对异常、中断、NVIC、内存模型和内核调试。

## 按课程查文档

| 课程 | 先看 | 建议搜索的章节标题或关键词 |
|---|---|---|
| 环境与第一个工程 | UM2563、UM2553、UM2609 | installation、create project、build、debug |
| GPIO | DS5319 + RM0008 + AN4899 | pin definitions、GPIO、AFIO、electrical characteristics |
| EXTI | RM0008 + PM0056 | EXTI、NVIC、exception priorities |
| UART | RM0008 + DS5319 | USART、alternate functions、baud rate |
| TIM/PWM | RM0008 + AN4776 | general-purpose timer、PWM mode、clock source |
| ADC/DMA | RM0008 + DS5319 + AN2834 + AN2548 | ADC calibration、sampling time、DMA channels |
| I²C | RM0008 + DS5319 + ES096 | I2C、7-bit address、timing、device limitations |
| SPI | RM0008 + DS5319 + ES096 | SPI、CPOL、CPHA、NSS、timing characteristics |

## 官方工具与示例

- [UM2563 · STM32CubeIDE installation guide](https://www.st.com/resource/en/user_manual/dm00603964-stm32cubeide-stmicroelectronics.pdf)
- [UM2553 · STM32CubeIDE quick start guide](https://www.st.com/resource/en/user_manual/um2553-stm32cubeide-quick-start-guide-stmicroelectronics.pdf)
- [UM2609 · STM32CubeIDE user guide](https://www.st.com/resource/en/user_manual/um2609-stm32cubeide-user-guide-stmicroelectronics.pdf)
- [UM2576 · STM32CubeIDE ST-LINK GDB server](https://www.st.com/resource/en/user_manual/dm00613038-stm32cubeide-st-link-gdb-server-stmicroelectronics.pdf)
- [STM32CubeF1 官方代码与示例](https://github.com/STMicroelectronics/STM32CubeF1)

## 专题应用笔记

- [AN4899 · GPIO hardware settings and low-power consumption](https://www.st.com/resource/en/application_note/dm00315319-stm32-gpio-configuration-for-hardware-settings-and-low-power-consumption-stmicroelectronics.pdf)
- [AN4776 · General-purpose timer](https://www.st.com/resource/en/application_note/an4776-generalpurpose-timer-cookbook-for-stm32-microcontrollers-stmicroelectronics.pdf)
- [AN2834 · ADC accuracy](https://www.st.com/resource/en/application_note/an2834-how-to-optimize-the-adc-accuracy-in-the-stm32-mcus-stmicroelectronics.pdf)
- [AN2548 · DMA controller](https://www.st.com/resource/en/application_note/an2548-using-the-stm32f0f1f3cxgxlx-series-dma-controller-stmicroelectronics.pdf)

!!! warning "文档的职责不同"
    Data Sheet 决定“这个具体型号有哪些引脚和电气限制”，Reference Manual 解释“外设怎样工作”，Programming Manual 解释“Cortex-M3 内核怎样工作”，Errata 记录“真实芯片有哪些已知偏差”。四类文档不能互相替代。

---
title: STM32F10x 标准外设库 V3.5 使用指南
---

# STM32F10x 标准外设库 V3.5：从文件夹到可运行工程

本地 `4--STM32固件库` 中的压缩包是 **STM32F10x Standard Peripheral Library V3.5.0**。解压后共有约 936 个文件，主要包括 CMSIS、外设驱动、工程模板和 ADC/CAN/DMA/GPIO/I²C/SPI/TIM/USART 等官方示例。

!!! info "它是库，不是一个单独项目"
    固件库不能像某个实验那样“整体下载运行”。正确用法是从模板建立自己的工程，再按需要加入外设驱动；`Project/STM32F10x_StdPeriph_Examples` 下的每个示例才是独立参考项目。

## 目录怎么读

| 目录 | 用途 |
|---|---|
| `Libraries/CMSIS` | Cortex-M3 内核接口、STM32F10x 设备定义、系统时钟和启动文件 |
| `Libraries/STM32F10x_StdPeriph_Driver` | 各外设的 `.c` 驱动与 `.h` 接口 |
| `Project/STM32F10x_StdPeriph_Template` | 多种开发环境的最小工程模板 |
| `Project/STM32F10x_StdPeriph_Examples` | 按外设分类的官方例程与 `readme.txt` |
| `Utilities` | ST 评估板驱动；自制板通常要改引脚和器件 |

## 建立 Keil 工程

1. 从 `Project/STM32F10x_StdPeriph_Template/MDK-ARM` 复制模板到新目录，避免直接改原库。
2. 在 Keil 中选择准确芯片型号，例如 STM32F103ZE 或 STM32F103C8。
3. 根据容量选择且只保留一个启动文件：C8 通常使用 medium-density，ZE 使用 high-density。
4. 添加 `system_stm32f10x.c`、`stm32f10x_it.c`、应用 `main.c` 和需要的外设驱动 `.c`。
5. 设置 CMSIS、驱动 `inc`、项目目录等头文件路径。
6. 定义正确的容量宏，并在 `stm32f10x_conf.h` 启用所需驱动头文件。
7. 先做 GPIO 翻转，再逐步加入 USART、定时器和 RTOS。

## 添加一个外设的固定流程

以 USART 为例：加入 `stm32f10x_usart.c` 与其头文件，打开 GPIO/AFIO/USART 时钟，配置引脚复用，填写 `USART_InitTypeDef`，启用外设，最后用示波器或 USB 转串口验证。每一步都要对照 RM0008，而不是只复制示例。

## 常见问题

| 现象 | 解决方法 |
|---|---|
| `stm32f10x.h` 找不到 | 补 CMSIS DeviceSupport 与驱动 `inc` 路径。 |
| 链接时报某外设函数未定义 | 把对应 `stm32f10x_xxx.c` 加入工程，不只是包含头文件。 |
| 出现多个中断或系统初始化定义 | 模板文件与自己工程的 `stm32f10x_it.c/system_stm32f10x.c` 重复，只保留一套。 |
| 一运行就 HardFault | 先查芯片、容量宏、启动文件、链接地址与系统时钟。 |
| 官方示例编译通过但板上无现象 | 示例面向 ST 评估板，必须按自己的原理图修改 LED、按键和外设引脚。 |
| 想与 HAL 混用 | 不建议在同一外设上混用两套初始化模型；迁移时按模块逐个替换并回归测试。 |

## 版本与迁移建议

V3.5.0 是旧版 STM32F1 标准外设库，适合维护老工程和理解寄存器级初始化。新项目可评估 STM32CubeF1/HAL 或 LL，但不要仅为了“更新”一次性重写稳定产品。迁移应锁定工具链、做外设回归测试，并核对勘误表。

## 专业名词

- **SPL**：Standard Peripheral Library，STM32 早期标准外设库。
- **CMSIS**：Arm Cortex 微控制器软件接口标准，包含内核与设备访问层。
- **容量宏**：区分低/中/高容量芯片资源与中断向量的预处理定义。
- **BSP**：板级支持包，把芯片驱动适配到特定板卡的 LED、按键和器件。

参考：[STM32F103 官方文档入口](https://www.st.com/en/microcontrollers-microprocessors/stm32f103/documentation.html)、[AN2953：旧固件库迁移到标准外设库 V3](https://www.st.com/resource/en/application_note/an2953-how-to-migrate-from-the-stm32f10xxx-firmware-library-v203-to-the-stm32f10xxx-standard-peripheral-library-v300-stmicroelectronics.pdf)、[STM32CubeF1](https://www.st.com/en/embedded-software/stm32cubef1.html)。

[返回资源中心](index.md)


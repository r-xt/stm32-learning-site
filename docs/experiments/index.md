---
title: ARM 核心板基础实验
---

# ARM 核心板基础实验

本栏目依据你提供的 `1--基础实验` 文件夹逐个整理。**27 个实验对应 27 篇独立文章**，每篇都包含实际工程配置、操作步骤、预期现象、常见故障和专业名词解释。

!!! warning "先确认芯片型号"
    原始工程并不全部面向 STM32F103C8T6：实验 1 的 Keil 目标是 **STM32F103C8 / `STM32F10X_MD`**；实验 2–27 的目标是 **STM32F103ZE / `STM32F10X_HD`**。后者通常对应 STM32F103ZET6 核心板，具有更多引脚和更大存储空间。不要只修改芯片名称就烧录到 C8T6，必须同时核对启动文件、宏定义、链接容量和引脚。

## 第一阶段：工程、GPIO 与中断

1. [库函数模板创建](01-library-template.md)
2. [使用库函数点亮一个 LED](02-led-on.md)
3. [STM32 时钟系统](03-clock-system.md)
4. [LED 闪烁与位带操作](04-bit-band-led.md)
5. [SysTick 系统定时器](05-systick.md)
6. [蜂鸣器](06-buzzer.md)
7. [数码管显示](07-seven-segment.md)
8. [按键控制](08-key-control.md)
9. [外部中断](09-exti.md)

## 第二阶段：定时、通信与可靠性

10. [定时器中断](10-timer-interrupt.md)
11. [PWM 呼吸灯](11-pwm-breathing-led.md)
12. [USART 串口通信](12-usart.md)
13. [`printf` 重定向](13-printf-retarget.md)
14. [独立看门狗](14-iwdg.md)
15. [窗口看门狗](15-wwdg.md)
16. [定时器输入捕获](16-input-capture.md)
17. [待机与唤醒](17-standby-wakeup.md)

## 第三阶段：采集、存储与工业总线

18. [ADC 模数转换](18-adc.md)
19. [内部温度传感器](19-internal-temperature.md)
20. [DMA 传输](20-dma.md)
21. [RTC 实时时钟](21-rtc.md)
22. [I²C EEPROM](22-i2c-eeprom.md)
23. [DS18B20 温度传感器](23-ds18b20.md)
24. [红外遥控](24-infrared-remote.md)
25. [RS485 通信](25-rs485.md)
26. [CAN 通信](26-can.md)
27. [程序加密保护与芯片 UID](27-uid-binding.md)

## 所有实验通用的操作顺序

1. 先看文章中的“芯片与接线”，确认自己的板卡能够使用这些引脚。
2. 打开实验目录中的 `Template.uvprojx`，检查 Device、启动文件和预处理宏。
3. 连接 ST-LINK，先编译，再下载；若无法连接，尝试降低 SWD 速度或 Connect under Reset。
4. 按文章说明连接模块，涉及外部接线时应先断电。
5. 用 LED、串口、万用表、示波器或逻辑分析仪验证结果，不只凭“看起来能运行”。

共同参考：[STM32F103ZE 官方产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)、[RM0008 参考手册](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf)。


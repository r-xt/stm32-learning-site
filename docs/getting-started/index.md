# 开始学习

如果你第一次接触 STM32，请按导航顺序完成六节课。每节课都采用同一结构：目标、准备、原理、操作、验证、故障排查和练习。

## 开始前准备

- 一块带板载 ST-LINK 的 STM32 Nucleo 板，推荐 NUCLEO-F103RB 或 NUCLEO-G071RB。
- 一根确认支持数据传输的 USB 线。
- Windows 10/11 电脑，并拥有安装软件的权限。
- 约 2 GB 磁盘空间以及首次下载安装时的网络连接。

!!! warning "确认具体型号"
    同一系列不同芯片的引脚、时钟和外设实例可能不同。课程使用通用思路，实际配置必须以你板卡的 User Manual、芯片 Data Sheet 和 Reference Manual 为准。

## 推荐顺序

1. [搭建开发环境](environment.md)
2. [创建第一个工程](first-project.md)
3. [掌握 GPIO](../courses/gpio.md)
4. [使用 EXTI 外部中断](../courses/exti.md)
5. [建立 UART 调试通道](../courses/uart.md)
6. [使用定时器和 PWM](../courses/tim-pwm.md)
7. 完成一个[项目实战](../projects/index.md)

## 遇到问题时

先记录四项信息：板卡完整型号、芯片丝印、工具版本、完整报错文本。然后按“供电与连线 → 调试器识别 → 工程目标芯片 → 时钟与引脚 → 代码”的顺序排查，效率通常最高。


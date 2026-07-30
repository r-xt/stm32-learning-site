# 入门路线

## 阶段目标

独立创建一个 HAL 工程，完成下载与断点调试，并通过 GPIO、EXTI、UART、TIM/PWM 控制和观察硬件。

## 必修清单

- [环境搭建](../getting-started/environment.md)与[第一个工程](../getting-started/first-project.md)
- [GPIO](../courses/gpio.md)、[EXTI](../courses/exti.md)
- [UART](../courses/uart.md)、[TIM/PWM](../courses/tim-pwm.md)
- 阅读板卡 User Manual、芯片 Data Sheet 的引脚章节
- 使用断点、Watch、寄存器视图和串口日志定位问题

## 阶段检查

完成 01～06 课程的练习并保存实验记录。项目统一安排在 01～09 课程之后，避免课程页、进度面板和路线页出现不同顺序。

## 自测问题

1. 为什么机械按键在中断模式下仍需消抖？
2. 重新生成 CubeMX 代码时，哪些区域会被保留？
3. UART 有 COM 口却输出乱码，应该怎样分层排查？
4. 72 MHz 定时器如何配置约 1 kHz PWM？

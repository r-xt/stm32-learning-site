---
title: 实验 09 · 外部中断
---

# 实验 09 · 外部中断实验

**原始工程目标：STM32F103ZE**  
**接线：K1→PB8/EXTI8，K2→PB9/EXTI9，D2→PA1**

## 实验目标与现象

把 PB8、PB9 映射到 EXTI8、EXTI9，按键产生下降沿时进入共享的 `EXTI9_5_IRQHandler()`。K1 点亮 D2，K2 熄灭 D2，主循环仍让 D1 闪烁。

## 操作步骤

1. 按实验 08 的方式连接按键与 D2。
2. 程序先设置 `NVIC_PriorityGroup_2`，然后配置 AFIO、EXTI 和 NVIC。
3. 下载并按 K1/K2，观察 D2；在中断函数设置断点可确认进入相同 IRQ。
4. 用调试器查看 EXTI 的 PR 挂起位；处理后必须写 1 清除对应位。

## 关键关系

PB8/PB9 并不会自动连接 EXTI。`GPIO_EXTILineConfig()` 负责选择端口来源；EXTI 决定触发边沿；NVIC 决定中断是否进入 CPU 以及优先级。EXTI5–EXTI9 共用一个中断入口，所以处理函数必须分别判断 Line8 和 Line9。

## 常见问题

| 问题 | 处理方法 |
|---|---|
| 完全不进中断 | 确认 AFIO 时钟、端口映射、EXTI Line、NVIC 通道和全局中断。 |
| 只响应一次 | 忘记清除 EXTI 挂起位。 |
| 一次按键触发多次 | 机械抖动；建议用定时器/主循环消抖，而不是在中断里长时间延时。 |
| 其他实时任务被卡住 | 原源码在 ISR 内 `delay_ms(10)`；中断服务应尽量只记录事件并快速退出。 |

## 专业名词

- **EXTI**：外部中断/事件控制器，把 GPIO 边沿等信号转换为中断或事件。
- **AFIO**：STM32F1 的复用功能 I/O 模块，也负责 EXTI 端口映射。
- **NVIC**：Cortex-M 的嵌套向量中断控制器。
- **ISR/IRQ**：中断服务程序/中断请求。
- **抢占优先级与子优先级**：前者决定能否打断另一个中断，后者用于同级排队。

参考：[RM0008 AFIO、EXTI 和中断章节](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf)。

[返回实验目录](index.md)


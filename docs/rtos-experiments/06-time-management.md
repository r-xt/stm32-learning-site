---
title: RTOS 实验 06 · 时间管理
---

# 实验 06 · 延时、周期等待与提前唤醒

**接线：D2 → PA1，D3 → PA2**  
**现象：三个任务以不同节奏翻转 LED，并演示提前结束另一个任务的延时**

## 操作步骤

1. LED1 任务每 1000 tick 翻转并打印 `OSTimeGet()`。
2. LED2 每 3000 tick 周期运行，并调用 `OSTimeDlyResume(&Led3TaskTCB, &err)`。
3. LED3 原计划延时 6 秒，但可被 LED2 提前解除延时。
4. 观察 LED3 实际间隔，确认它不是固定 6 秒。
5. 分别测试相对延时与周期延时，记录负载增大后的差别。

## 实现逻辑

`OSTimeGet()` 读取内核 tick 计数；`OSTimeDly*()` 让当前任务等待；`OSTimeDlyResume()` 只用于提前结束目标任务的时间延时，不能代替信号量做一般事件通知。

## 常见问题

| 现象 | 解决方法 |
|---|---|
| 提前唤醒失败 | 目标任务必须正处于时间延时状态，并检查返回错误码。 |
| 任务周期越来越晚 | 使用周期选项，避免“执行时间 + 相对延时”不断累积。 |
| 打印 tick 为负数 | 使用无符号且宽度匹配的格式输出。 |
| 把恢复延时当成事件 | 业务事件应使用信号量、队列或任务通知，语义更清楚。 |

## 专业名词

- **相对延时**：从调用时刻开始等待指定时长。
- **周期调度**：尽量按固定相位重复运行。
- **提前唤醒**：在超时前移除任务的时间等待条件。
- **单调时钟**：只前进、不受日历时间调整影响的计时基准。

参考：[Micrium Kernel 时间管理](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)、[STM32F103ZE 产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)。

[返回 RTOS 实验目录](index.md)


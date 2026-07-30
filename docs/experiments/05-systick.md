---
title: 实验 05 · SysTick 系统定时器
---

# 实验 05 · SysTick 系统定时器

**原始工程目标：STM32F103ZE，系统时钟按 72 MHz 初始化**  
**实验现象：D1 每 500 ms 改变一次状态**

## 操作步骤

1. 初始化 LED 后调用 `SysTick_Init(72)`；参数表示系统时钟为 72 MHz。
2. 源码选择 `HCLK/8` 作为 SysTick 时钟，因此每微秒需要 9 个计数。
3. 在循环中依次执行 `delay_ms(500)` 并改变 PA0 状态。
4. 下载后用示波器测 PA0，完整周期应接近 1 s。
5. 如果系统时钟不是 72 MHz，必须把初始化参数改为真实频率。

## 常见问题

| 现象 | 原因与解决方法 |
|---|---|
| 延时整体偏快/偏慢 | `SysTick_Init()` 参数与真实 SYSCLK 不一致。 |
| 长延时异常 | SysTick 的 LOAD 只有 24 位；72 MHz、HCLK/8 时单次约不能超过 1864 ms。 |
| 加入 RTOS 后延时冲突 | 操作系统通常占用 SysTick；应改用系统节拍 API 或其他定时器。 |
| 程序在延时期间什么都不做 | 该实现是轮询阻塞延时；多任务项目应使用非阻塞状态机或中断。 |

## 专业名词

- **SysTick**：Cortex-M 内核自带的 24 位递减计数器。
- **LOAD/VAL/CTRL**：重装值、当前值和控制状态寄存器。
- **COUNTFLAG**：计数器从 1 变为 0 时置位的状态标志。
- **阻塞延时**：CPU 一直等待计时结束，期间无法处理主循环中的其他任务。
- **系统节拍**：操作系统或软件调度使用的周期性时间基准。

参考：[PM0056 SysTick 章节](https://www.st.com/resource/en/programming_manual/cd00228163-stm32f10xxx20xxx21xxxl1xxxx-cortexm3-programming-manual-stmicroelectronics.pdf)。

[返回实验目录](index.md)


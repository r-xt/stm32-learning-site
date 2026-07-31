---
title: RTOS 实验 07 · 软件定时器
---

# 实验 07 · 创建周期软件定时器

**配置：软件定时器任务频率 100 Hz**  
**目标：周期回调翻转 LED、输出参数并测量间隔**

## 操作步骤

1. 确认 `OS_CFG_TMR_EN` 已启用，`OS_CFG_TMR_TASK_RATE_HZ` 为 100 Hz。
2. 声明长期有效的 `OS_TMR` 对象，不要让对象在任务退出后失效。
3. 调用 `OSTmrCreate()` 创建周期定时器，再检查 `err`。
4. 调用 `OSTmrStart()`，在回调中只做短小、非阻塞的工作。
5. 若希望 1 秒周期，在 100 Hz 时基下把周期值设为 100，而不是原代码的 10。
6. 运行 5 次后删除定时器，确认回调停止。

!!! danger "原工程有两处会误导结果"
    `OS_CFG_TMR_TASK_RATE_HZ` 实际是 100 Hz，因此 period=10 约为 100 ms，不是注释写的 1 秒；此外 `OSTmrCreate()` 和 `OSTmrStart()` 最后一个参数写成了 `(OS_ERR *)err`，应传 `&err`，否则可能写入无效地址。

## 常见问题

| 现象 | 解决方法 |
|---|---|
| 回调快了 10 倍 | 按软件定时器任务频率换算 period，不要按系统 tick 猜。 |
| 创建时 HardFault | 把错误参数改成 `&err`，并确认定时器对象地址有效。 |
| 回调里延时导致其他定时器异常 | 回调只发通知，把耗时工作交给普通任务。 |
| 删除后又访问对象 | 删除成功后更新状态，避免再次启动同一失效对象。 |

## 专业名词

- **软件定时器**：由内核任务管理的定时事件，不是单片机硬件 TIM 外设。
- **回调函数**：定时到期后由内核调用的函数。
- **定时器时基**：软件定时器计数更新频率，可能与系统 tick 不同。
- **单次/周期定时器**：到期一次后停止，或按设定周期持续重装。

参考：[Micrium Kernel 软件定时器](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)、[STM32F103ZE 文档页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)。

[返回 RTOS 实验目录](index.md)


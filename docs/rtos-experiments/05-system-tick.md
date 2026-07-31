---
title: RTOS 实验 05 · 系统时钟节拍
---

# 实验 05 · 用时间戳验证系统 tick

**配置：`OS_CFG_TICK_RATE_HZ = 1000`**  
**现象：延时 1000 tick 后，串口测得约 1 秒**

## 操作步骤

1. 确认 `os_cfg_app.h` 的系统节拍频率是 1000 Hz。
2. 在任务中先调用 `OS_TS_GET()` 记录开始时间戳。
3. 调用 `OSTimeDly(1000, OS_OPT_TIME_DLY, &err)`。
4. 再读时间戳并用 CPU 时钟换算为微秒、毫秒。
5. 串口观察结果，并用 GPIO 翻转加示波器做第二种验证。

## 怎样计算

tick 周期为 `1 / OS_CFG_TICK_RATE_HZ`。本工程 1000 Hz 对应 1 ms/tick，所以 1000 tick 的理论延时是 1 s。实际唤醒还会受到中断延迟和更高优先级任务执行时间影响。

## 常见问题

| 现象 | 解决方法 |
|---|---|
| 1000 tick 不是 1 秒 | 检查 tick 配置、SysTick 重装值和真实 CPU 时钟。 |
| 打印值溢出或异常 | 使用与 `CPU_TS` 宽度匹配的格式，并处理计数器回绕。 |
| 串口打印干扰测量 | 在延时前后只采时间戳，打印放到测量区间之外。 |
| 高负载时延时变长 | `OSTimeDly` 保证最早唤醒时间，不保证任务立刻获得 CPU。 |

## 专业名词

- **tick**：内核周期性时间基准，不等同于 CPU 时钟周期。
- **时间戳**：用于记录事件发生时刻的单调计数值。
- **抖动**：周期事件相对理想时刻的短期偏差。
- **回绕**：有限位宽计数器到最大值后从零重新计数。

参考：[Micrium Kernel 时间管理](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)、[Arm Cortex-M3 SysTick](https://developer.arm.com/documentation/dui0552/latest/)。

[返回 RTOS 实验目录](index.md)


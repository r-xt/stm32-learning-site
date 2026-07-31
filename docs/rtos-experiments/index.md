---
title: uC/OS-III 实验目录
---

# uC/OS-III 实验：16 个工程，16 篇教程

本栏目根据本地 `2--RTOS操作系统实验/1-uCOS操作系统` 中的 Keil 工程逐个核对。原工程目标均为 **STM32F103ZE**，内核为 **uC/OS-III V3.03.00**，系统节拍为 1000 Hz，软件定时器任务频率为 100 Hz。

!!! warning "不要直接当作 STM32F103C8T6 工程"
    F103ZE 与 F103C8T6 的 Flash、RAM、启动文件和可用引脚不同。若换成 C8T6，需要重新选设备、启动文件和容量宏，并检查任务栈总量。

## 建议顺序

| 阶段 | 独立文章 | 核心收获 |
|---|---|---|
| 移植 | [01 基础工程](01-porting-foundation.md) · [02 移植模板](02-port-template.md) | 先验证裸机，再启动内核 |
| 任务 | [03 多任务](03-multi-task.md) · [04 任务生命周期](04-task-lifecycle.md) | 创建、调度、挂起、恢复和删除 |
| 时间 | [05 时钟节拍](05-system-tick.md) · [06 时间管理](06-time-management.md) · [07 软件定时器](07-software-timer.md) | tick、延时、时间戳和定时器 |
| 同步 | [08 信号量等待事件](08-counting-semaphore-events.md) · [09 信号量管理资源](09-counting-semaphore-resource.md) · [10 互斥量](10-mutex.md) | 事件通知、资源计数和互斥 |
| 通信 | [11 消息队列](11-message-queue.md) · [12 等待多个对象](12-multi-pend.md) · [13 任务信号量](13-task-semaphore.md) · [14 任务消息队列](14-task-message-queue.md) | 任务间通知与数据传递 |
| 管理 | [15 内存管理](15-memory-management.md) · [16 任务管理](16-task-management.md) | 固定内存块、任务寄存器和运行状态 |

## 已核实的原始资料问题

- 实验 11 压缩包中的 `main.c` 与实验 10 完全相同，并没有消息队列实现。
- 实验 15 压缩包中的 `main.c` 与实验 14 完全相同，并没有内存分区实现。
- 实验 7 的软件定时器频率配置为 100 Hz，源码却按 10 Hz 解释；周期值 10 实际约为 100 ms。
- 多个工程直接调用内部函数 `OS_TaskSuspend()`；新代码建议使用公开接口 `OSTaskSuspend()`。

因此，实验 11 和 15 的文章会保留原包审计结论，同时给出正确的实现步骤和最小代码框架。

## 共用准备

1. 安装 Keil MDK，并确认可以选择 STM32F103ZE。
2. 使用 ST-Link 连接 SWDIO、SWCLK、GND 和 3.3 V，先运行实验 1 验证下载链路。
3. 串口实验默认初始化 USART1 为 9600 bit/s；接线前核对板卡原理图。
4. 每次调用内核 API 后观察 `OS_ERR err`，不要只看编译是否通过。
5. 修改任务数量或栈大小后，重新检查 RAM 占用与栈余量。

参考：[STM32F103ZE 产品与文档](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)、[Silicon Labs Micrium OS Kernel 编程指南](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)。后者是新版本文档，概念可用于核对，但 API 类型与本实验的 V3.03.00 可能不同。


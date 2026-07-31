---
title: RTOS 实验 02 · uC/OS-III 移植模板
---

# 实验 02 · 启动 uC/OS-III 移植模板

**目标：完成 `OSInit → 创建启动任务 → OSStart` 的最小闭环**  
**现象：LED1 约每 200 ms 翻转，串口 9600 bit/s 已初始化**

## 操作步骤

1. 先确认实验 1 能正常闪灯，再打开实验 2。
2. 检查工程已加入 CPU、Lib、uC/OS-III Source、Port 和 `uCOS_CONFIG` 文件。
3. 在 `main()` 依次初始化板级外设、调用 `OSInit()`、创建 `start_task`，最后调用 `OSStart()`。
4. 启动任务中执行 `CPU_Init()`，再创建 LED 任务。
5. 用公开接口 `OSTaskSuspend(&StartTaskTCB, &err)` 挂起启动任务，观察 LED 周期运行。
6. 单步检查每次内核调用后的 `err` 是否为 `OS_ERR_NONE`。

## 关键调用顺序

```c
OSInit(&err);
OSTaskCreate(&StartTaskTCB, "start", start_task, 0, START_TASK_PRIO,
             &START_TASK_STK[0], START_STK_SIZE / 10, START_STK_SIZE,
             0, 0, 0, OS_OPT_TASK_STK_CHK | OS_OPT_TASK_STK_CLR, &err);
OSStart(&err);
```

!!! note "原工程值得改的一处"
    原代码调用内部函数 `OS_TaskSuspend()`。它在该版本源码中存在，但应用代码应优先使用公开 API `OSTaskSuspend()`，以保留参数检查和一致的调度行为。

## 常见问题

| 现象 | 解决方法 |
|---|---|
| `OSStart()` 后无任务运行 | 确认启动任务创建成功、优先级合法、栈地址和大小正确。 |
| 链接时缺少 `OS_CPU_*` | 检查 Cortex-M3 端口文件和对应汇编文件是否加入工程。 |
| 一开调度就 HardFault | 重点查任务栈、PendSV/SysTick/SVC 向量和编译器端口。 |
| 串口能输出但 LED 不动 | 检查任务是否被错误挂起，及 `err` 的具体值。 |

## 专业名词

- **TCB**：任务控制块，保存任务状态、优先级、栈指针等信息。
- **任务栈**：保存局部变量、函数调用现场和异常上下文的独立内存。
- **调度器**：从就绪任务中选择下一个运行任务的内核组件。
- **PendSV**：Cortex-M 常用于执行上下文切换的可挂起异常。

参考：[Micrium Kernel 初始化与任务管理](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)、[STM32F103ZE 文档页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)。

[返回 RTOS 实验目录](index.md)


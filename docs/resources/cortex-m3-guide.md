---
title: Cortex-M3 资料学习指南
---

# 《Cortex-M3 权威指南》怎么学、怎么验证

本地资料为 Joseph Yiu 著作的早期中文译稿，共 298 页。它适合理解 Cortex-M3 的异常、NVIC、SysTick、栈、特权级和调试结构，但不是 STM32F103 外设手册，也不能代替最新 Arm 架构文档。

## 推荐学习项目

1. **异常与向量表**：在 Keil 中查看启动文件，找到 Reset、HardFault、SysTick 和 PendSV 入口。
2. **双栈指针**：在调试器中观察 MSP；进入 RTOS 任务后理解 PSP 如何保存任务上下文。
3. **NVIC 优先级**：建立两个定时中断，改变抢占优先级并用 GPIO 测量嵌套。
4. **SysTick**：配置 1 ms 中断并测量实际周期，再与 RTOS tick 连接。
5. **故障定位**：故意访问非法地址，在 HardFault 中读取堆栈现场和故障寄存器。

## 常见问题

| 问题 | 解决方法 |
|---|---|
| 把 Cortex-M3 当成 STM32 型号 | Cortex-M3 是 CPU 内核；RCC、GPIO、USART 等由 STM32 芯片实现。 |
| 中断优先级数字越大越高 | Cortex-M 中通常数值越小优先级越高，还要考虑芯片实现位数。 |
| 修改向量表后中断失效 | 检查对齐、VTOR 地址、链接脚本和实际 Flash/RAM 区域。 |
| HardFault 只会死循环 | 保存堆栈帧与 CFSR/HFSR/BFAR/MMFAR，再分析触发原因。 |

## 专业名词

- **MSP/PSP**：主栈指针与进程栈指针。
- **NVIC**：嵌套向量中断控制器。
- **异常**：由中断、错误或系统服务触发的处理器控制流切换。
- **特权级**：限制代码访问系统资源的处理器权限状态。

阅读时同时查：[Arm Cortex-M3 Generic User Guide](https://developer.arm.com/documentation/dui0552/latest/)、[STM32F103 官方文档](https://www.st.com/en/microcontrollers-microprocessors/stm32f103/documentation.html)。本地译稿年代较早，结论冲突时以对应版本的 Arm 与 ST 官方文档为准。

[返回资源中心](index.md)


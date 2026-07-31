---
title: RTOS 实验 01 · 移植前基础工程
---

# 实验 01 · 建立可移植 uC/OS-III 的基础工程

**目标芯片：STM32F103ZE**  
**原工程现象：LED1 每约 200 ms 翻转一次**

## 为什么先做裸机工程

移植 RTOS 前先证明时钟、SysTick、GPIO、启动文件和下载器都正常。原工程没有启动 uC/OS-III，只在主循环中每 10 ms 累加一次计数，计到 20 次翻转 LED。这样后续若 RTOS 模板不运行，就能把问题集中到内核移植层。

## 操作步骤

1. 打开 `Template.uvprojx`，确认设备为 STM32F103ZE，容量宏为 `STM32F10X_HD`。
2. 检查启动文件与 High-density 器件匹配。
3. 编译并下载；复位后观察 LED1 是否稳定闪烁。
4. 在 `main()` 中给翻转语句设断点，确认循环确实执行。
5. 记录 `SystemCoreClock`、SysTick 初始化参数和 LED 实际引脚，作为下一课移植基线。

## 实现要点

`SysTick_Init(72)` 依赖 72 MHz 系统时钟；如果实际频率不同，裸机延时和 RTOS tick 都会偏差。移植时还要避免裸机延时函数与内核共同改写 SysTick 寄存器。

## 常见问题

| 现象 | 解决方法 |
|---|---|
| LED 完全不亮 | 查 LED 引脚、有效电平和 GPIO 时钟，不要先怀疑 RTOS。 |
| 闪烁速度明显不对 | 核对外部晶振、PLL 倍频和 `SystemCoreClockUpdate()`。 |
| 下载后 HardFault | 检查设备型号、启动文件、向量表地址和链接容量。 |
| 换成 C8T6 后不能运行 | 改为对应设备与中等容量启动文件，并重新检查引脚。 |

## 专业名词

- **基础工程**：只保留已验证的启动、时钟、驱动和调试配置，供后续功能叠加。
- **向量表**：保存复位入口与各中断处理函数地址的数据表。
- **SysTick**：Cortex-M 内核的系统定时器，常用于产生 RTOS 节拍。
- **移植层**：让操作系统适配特定 CPU、编译器和板级时钟的代码。

参考：[STM32F103ZE 产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)、[Arm Cortex-M3 Generic User Guide](https://developer.arm.com/documentation/dui0552/latest/)、[Micrium Kernel 初始化指南](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)。

[返回 RTOS 实验目录](index.md)

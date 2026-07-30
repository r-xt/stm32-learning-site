---
title: 实验 03 · STM32 时钟系统
---

# 实验 03 · STM32 时钟系统

**原始工程目标：STM32F103ZE**  
**实验现象：PA0 上的 D1 闪烁**

## 实验目标

理解 HSE、PLL、SYSCLK、HCLK、PCLK1 和 PCLK2 的关系，并通过改变系统时钟观察软件延时和 LED 闪烁速度变化。

原始代码调用：

```c
RCC_HSE_Config(RCC_PLLSource_HSE_Div2, RCC_PLLMul_9);
```

若板载 HSE 为 8 MHz，则 `8 MHz ÷ 2 × 9 = 36 MHz`。AHB 为 36 MHz，APB1 为 18 MHz，APB2 为 36 MHz。

## 操作步骤

1. 打开工程并确认板载高速晶振频率；本源码按常见的 8 MHz HSE 推导。
2. 编译下载，观察 D1 的闪烁周期。
3. 在调试器中查看 `RCC->CFGR`，确认系统时钟源状态为 PLL。
4. 将配置改为 HSE 不分频、PLL ×9，可得到 72 MHz；同步调整延时参数后再次比较。
5. 修改时钟后调用 `SystemCoreClockUpdate()`，并重新检查串口、SysTick、定时器等所有依赖时钟的模块。

## 常见问题

| 问题 | 原因与解决方法 |
|---|---|
| 程序卡在等待 HSE | 晶振未起振、频率不符或负载电容/焊接有问题；先改用 HSI 验证。 |
| 串口突然乱码 | 波特率计算仍按旧 PCLK，必须重新初始化串口。 |
| LED 速度与计算不一致 | `while` 忙等待受编译优化影响，不能当精确定时器。 |
| 72 MHz 下不稳定 | 核对 Flash 等待周期、预取、供电和 APB1 不超过 36 MHz。 |

## 专业名词

- **HSE/HSI**：外部/内部高速时钟源。
- **PLL**：锁相环，把输入时钟倍频得到更高系统时钟。
- **SYSCLK**：系统时钟源；**HCLK** 为 AHB/CPU 时钟；**PCLK1/PCLK2** 分别供 APB1/APB2 外设。
- **Flash 等待周期**：CPU 较快时，Flash 读取需要插入等待状态。
- **时钟树**：从振荡源经过选择、倍频和分频后到达内核与外设的结构。

参考：[RM0008 RCC 章节](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf)。

[返回实验目录](index.md)


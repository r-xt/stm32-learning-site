---
title: 实验 04 · LED 闪烁与位带操作
---

# 实验 04 · LED 闪烁与位带操作

**原始工程目标：STM32F103ZE**  
**实际引脚：D1 → PA0**

## 实验目标与现象

把 GPIO 输出寄存器的某一位映射为可直接读写的“别名地址”，通过 `led1 = !led1` 翻转 PA0，使 D1 闪烁。

## 操作步骤

1. 打开工程，检查 `system.h` 中 `BITBAND`、`BIT_ADDR` 和 `PAout(n)` 定义。
2. 确认 `led.h` 把 `led1` 映射到 `PAout(0)`。
3. 编译下载，D1 应按忙等待延时闪烁。
4. 在调试器中观察 GPIOA 的 `ODR` bit0；每次执行 `led1=!led1` 都应翻转。
5. 把宏改为其他有效 GPIO 进行实验时，先确认对应端口时钟和输出模式已配置。

## 位带原理

Cortex-M3 把外设位带区的一位映射到别名区的一个 32 位字。向别名字写 0 或 1，就相当于原子地清除或置位目标位，不需要先读整个寄存器再修改。

## 常见问题

| 问题 | 处理方法 |
|---|---|
| 编译提示左值错误 | 位带宏必须最终解引用为 `volatile` 地址，不能漏掉 `MEM_ADDR`。 |
| 修改后 HardFault | 地址或位号超出位带区；GPIO 位号只能是 0–15。 |
| LED 不闪 | 先确认 `LED_Init()` 已把目标引脚设为输出。 |
| 想移植到所有 Cortex-M | 位带不是所有 Cortex-M 或所有地址区域都支持，应查具体内核和芯片手册。 |

## 专业名词

- **位带（Bit-band）**：把一个位映射成一个字地址的 Cortex-M3/M4 特性。
- **别名区**：用于访问位带位的地址范围。
- **原子操作**：操作过程中不会暴露“读后尚未写回”的中间状态。
- **ODR/IDR**：GPIO 输出数据寄存器/输入数据寄存器。
- **`volatile`**：告诉编译器该地址可能被硬件或其他执行流改变，不应随意省略访问。

参考：[PM0056 Cortex-M3 编程手册](https://www.st.com/resource/en/programming_manual/cd00228163-stm32f10xxx20xxx21xxxl1xxxx-cortexm3-programming-manual-stmicroelectronics.pdf)。

[返回实验目录](index.md)


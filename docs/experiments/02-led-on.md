---
title: 实验 02 · 使用库函数点亮 LED
---

# 实验 02 · 使用库函数点亮一个 LED

**原始工程目标：STM32F103ZE，High-density**  
**实际引脚：D1 → PA0**

## 实验目标与现象

使用标准外设库打开 GPIOA 时钟，把 PA0 配置为 50 MHz 推挽输出，并让核心板 D1 常亮。源码先调用 `LED_Init()`，再在循环中执行 `GPIO_SetBits(GPIOA, GPIO_Pin_0)`。

## 操作步骤

1. 确认板上 MCU 是 STM32F103ZE/ZET6；如果是 C8T6，请不要直接使用该工程配置。
2. 打开本实验的 `Template.uvprojx`，确认宏为 `STM32F10X_HD`，启动文件为 `startup_stm32f10x_hd.s`。
3. 不需要外部接线，D1 位于核心板 PA0。
4. 编译并下载程序，复位后观察 D1。
5. 用万用表测 PA0：源码把 PA0 置高时应接近 3.3 V。

## 代码为什么这样写

GPIO 在使用前必须先通过 RCC 打开端口时钟。`GPIO_Mode_Out_PP` 表示推挽输出，能够主动输出高、低电平。头文件把端口、引脚和时钟定义成宏，便于以后把 LED 移到其他引脚。

!!! note "源码注释有一处不一致"
    `LED_Init()` 末尾调用 `GPIO_ResetBits()`，实际是把 PA0 拉低；原注释却写成“拉高”。应以函数行为和实测电平为准。本工程随后用 `GPIO_SetBits()` 点亮 D1，说明它按“高电平点亮”使用。

## 常见问题

| 现象 | 处理方法 |
|---|---|
| 编译通过但 D1 不亮 | 确认 D1 真的连接 PA0；不同核心板的 LED 引脚和有效电平可能不同。 |
| LED 逻辑与教程相反 | 查原理图确认是高电平还是低电平点亮，不要凭颜色或丝印猜测。 |
| `GPIO_SetBits` 未定义 | 检查标准外设库 GPIO 源文件是否加入工程。 |
| 改成其他端口后没反应 | 同时修改 `LED_PORT`、`LED_PIN` 和 `LED_PORT_RCC`。 |

## 专业名词

- **GPIO**：通用输入输出口，可由软件配置为输入、输出或复用功能。
- **RCC**：复位与时钟控制模块；外设时钟未开启时，写外设寄存器通常不会生效。
- **推挽输出**：上下两个驱动管主动产生高、低电平，适合 LED 等数字输出。
- **有效电平**：使器件动作的逻辑电平，可能是高有效，也可能是低有效。

参考：[STM32F103ZE 产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)、[RM0008 GPIO 章节](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf)。

[返回实验目录](index.md)


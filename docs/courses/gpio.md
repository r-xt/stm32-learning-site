---
title: 03 · GPIO 输入输出
description: 理解数字电平、输出模式和输入上下拉
---

# 03 · GPIO 输入输出

<div class="lesson-progress" data-lesson-id="gpio-001" data-lesson-title="GPIO 输入输出"></div>

## 学习目标

- 理解输入、推挽输出、开漏输出和上下拉；
- 使用 HAL 读写引脚；
- 根据板卡原理图判断 LED 和按键的有效电平；
- 避免悬空输入和过流风险。

## 核心概念

GPIO 输出不是“输出一个数字”，而是让引脚驱动接近电源或地的电压。GPIO 输入则把引脚电压按门限解释为 0 或 1。

| 模式 | 典型用途 | 注意事项 |
|---|---|---|
| 推挽输出 | LED、普通数字控制 | 可主动输出高、低电平 |
| 开漏输出 | I²C、线与信号 | 输出高电平依赖上拉电阻 |
| 浮空输入 | 外部已有确定驱动 | 没有驱动时读值不稳定 |
| 上拉/下拉输入 | 按键、默认状态信号 | 内部电阻较弱，长线需评估干扰 |
| 复用功能 | UART、SPI、TIM 等 | 引脚由外设而非普通 GPIO 控制 |

!!! warning "先看原理图"
    许多板载 LED 是低电平点亮，用户按键也可能低电平有效。不要凭经验猜极性。

## 配置实验

在 `.ioc` 的 Pinout 视图中：

1. 将板载 LED 引脚设为 `GPIO_Output`，标签改为 `LED`。
2. 初始输出电平设为 LED 的熄灭状态。
3. 将用户按键引脚设为 `GPIO_Input`，标签改为 `BUTTON`。
4. 根据原理图选择内部上拉、下拉或不使用内部电阻。
5. 生成代码并确认 `gpio.c` 中初始化的端口、引脚和模式正确。

## 输出：让 LED 闪烁

```c
while (1)
{
  HAL_GPIO_TogglePin(LED_GPIO_Port, LED_Pin);
  HAL_Delay(500);
}
```

`HAL_Delay()` 适合第一课验证，但它会阻塞当前执行流。后续会用定时器或系统节拍替代。

## 输入：按键控制 LED

下面假设按键按下时为低电平，LED 写入 `GPIO_PIN_SET` 时点亮；请按你的硬件极性调整。

```c
GPIO_PinState pressed = HAL_GPIO_ReadPin(BUTTON_GPIO_Port, BUTTON_Pin);

if (pressed == GPIO_PIN_RESET)
{
  HAL_GPIO_WritePin(LED_GPIO_Port, LED_Pin, GPIO_PIN_SET);
}
else
{
  HAL_GPIO_WritePin(LED_GPIO_Port, LED_Pin, GPIO_PIN_RESET);
}
```

## 用调试器验证

在读取按键后设置断点，观察 `pressed`。如果按键状态始终不变：

1. 核对引脚标签是否映射到正确端口；
2. 测量引脚松开、按下时的实际电压；
3. 检查上下拉配置；
4. 确认引脚没有被其他外设复用。

## 常见问题

??? question "LED 一直亮或一直灭"
    先确定有效电平，再确认初始化阶段是否写入了意外电平。使用调试器查看 GPIO 输出数据寄存器，也可用万用表测量引脚。

??? question "按键不碰也随机变化"
    这是典型的输入悬空。配置内部上拉/下拉或添加合适的外部电阻。

??? question "能否直接驱动电机或继电器？"
    不能。GPIO 电流能力有限，感性负载还会产生反向电压。应使用晶体管/MOSFET、续流二极管和独立电源设计。

## 练习

- 将闪烁周期改成“亮 100 ms、灭 900 ms”。
- 同时读取两个按键，做一个简单的优先级逻辑。
- 不改业务代码，只调整 `.ioc` 的初始电平，让复位后的 LED 保持熄灭。

## 官方资料与核对路径

| 文档 | 建议核对内容 |
|---|---|
| [DS5319 · STM32F103x8/xB Data Sheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf) | `Pinouts and pin description`、复用功能和 I/O 电气特性 |
| [RM0008 · STM32F1 Reference Manual](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf) | `General-purpose and alternate-function I/Os`、AFIO |
| [AN4899 · GPIO hardware settings](https://www.st.com/resource/en/application_note/dm00315319-stm32-gpio-configuration-for-hardware-settings-and-low-power-consumption-stmicroelectronics.pdf) | 输入状态、输出类型、未使用引脚和低功耗配置 |

文档职责和版本核验方法见 [F103C8T6 官方资料索引](../resources/f103-official-docs.md)。

## 下一步

[让按键通过中断触发事件 →](exti.md)

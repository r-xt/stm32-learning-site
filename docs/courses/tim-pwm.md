---
title: 06 · TIM 与 PWM
description: 使用硬件定时器生成节拍和可调占空比波形
---

# 06 · TIM 与 PWM

<div class="lesson-progress" data-lesson-id="tim-pwm-001" data-lesson-title="TIM 与 PWM"></div>

## 学习目标

- 理解定时器输入时钟、预分频器和自动重装值；
- 计算更新事件和 PWM 的频率；
- 启动 PWM 并动态修改占空比；
- 区分阻塞延时、定时器中断和硬件 PWM。

## 频率关系

对常见向上计数配置：

```text
计数频率 = TIM 输入时钟 / (PSC + 1)
更新频率 = 计数频率 / (ARR + 1)
PWM 占空比 ≈ CCR / (ARR + 1)
```

例如定时器输入时钟为 72 MHz，`PSC = 71`、`ARR = 999`，计数频率为 1 MHz，更新/PWM 频率约为 1 kHz。

!!! warning "定时器时钟不一定等于总线时钟"
    某些 STM32 系列在 APB 预分频不为 1 时会对定时器时钟倍频。必须查看 CubeMX Clock Configuration 和对应 Reference Manual，不能只看 CPU 主频。

## 配置 PWM

1. 在 `.ioc` 中选择一个连接到 LED 或外部测试点的 TIM 通道，设为 PWM Generation。
2. 设置 Prescaler、Counter Period（ARR）和初始 Pulse（CCR）。
3. 检查 GPIO 自动切换为正确 Alternate Function。
4. 生成代码，并在初始化完成后启动 PWM：

```c
if (HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_1) != HAL_OK)
{
  Error_Handler();
}
```

## 非阻塞呼吸灯

以下逻辑每 5 ms 修改一次占空比，不使用长时间 `HAL_Delay()`：

```c
uint32_t last_fade_tick = 0;
uint32_t duty = 0;
int32_t step = 10;
const uint32_t period = __HAL_TIM_GET_AUTORELOAD(&htim3);

while (1)
{
  uint32_t now = HAL_GetTick();
  if ((now - last_fade_tick) >= 5U)
  {
    last_fade_tick = now;

    if (step > 0 && duty >= period)
      step = -10;
    else if (step < 0 && duty <= 10U)
      step = 10;

    duty = (uint32_t)((int32_t)duty + step);
    __HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_1, duty);
  }
}
```

若 LED 为低电平有效，亮度方向可能相反；这不影响 PWM 原理。

## 用中断生成软件节拍

如果需要周期执行代码，可以配置 Base Timer 并启用更新中断：

```c
volatile uint8_t timer_event = 0;

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
  if (htim->Instance == TIM6)
  {
    timer_event = 1;
  }
}
```

仍建议在主循环处理耗时业务。硬件 PWM 则无需每周期进入中断，波形由定时器直接生成。

## 验收方法

- LED 亮度平滑往返变化，主循环仍能同时响应按键。
- 用逻辑分析仪或示波器测得频率与计算值相符。
- 将 CCR 设为 0、ARR 的一半和接近 ARR，分别观察 0%、约 50% 和接近 100% 占空比。
- 修改系统时钟后重新核对定时器输入时钟和 PSC/ARR。

## 常见问题

??? question "计数在运行，但引脚没有 PWM"
    检查是否调用 `HAL_TIM_PWM_Start`、通道是否一致、引脚是否为正确复用功能、板上 LED 是否真的连接到该通道。

??? question "实测频率正好差两倍"
    常见原因是忽略 APB 定时器时钟倍频，或把 ARR/PSC 公式中的 `+1` 漏掉。

??? question "呼吸灯在两端跳变"
    检查无符号数下溢。示例在做加减前先判断边界，并通过有符号 `step` 控制方向。

## 练习

- 配置 20 kHz PWM，解释它为什么常用于避开可听频段。
- 用按键在 25%、50%、75% 三档占空比之间切换。
- 不进入中断，仅靠硬件 PWM 输出稳定波形，同时用 UART 打印主循环计数。

## 下一步

[完成 LED 与按键控制器项目 →](../projects/led-button.md)


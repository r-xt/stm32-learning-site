---
title: STM32 学习站
hide:
  - toc
---

<div class="hero" markdown>

# 从点亮 LED，到构建可靠系统

一条本地优先、项目驱动的 STM32 学习路径。每节课都有明确产出、验证方法和常见故障处理，不要求你先成为硬件专家。

[从环境搭建开始](getting-started/environment.md){ .md-button .md-button--primary }
[查看完整路线](tracks/index.md){ .md-button }
[打开本地知识助手](assistant/index.md){ .md-button }

</div>

## 你将怎样学习

<div class="card-grid" markdown>

<div class="card" markdown>
### 1 · 先跑起来
安装工具，创建第一个工程，学会编译、下载、断点和串口日志。
</div>

<div class="card" markdown>
### 2 · 理解外设
围绕 GPIO、EXTI、UART、定时器和 PWM 做可观察的实验。
</div>

<div class="card" markdown>
### 3 · 做成项目
把零散知识放入状态机、驱动分层和故障处理等真实工程结构中。
</div>

<div class="card" markdown>
### 4 · 走向系统
继续学习 DMA、RTOS、低功耗、Bootloader、安全更新和平台化设计。
</div>

</div>

## 遇到问题，先问本地知识助手

<div class="assistant-intro" markdown>

<div markdown>

### STM32 与计算机知识随时查询

不知道串口为什么乱码、GPIO 为什么没有输出，或者对指针、位运算、RTOS 仍有疑问？全站右下角的本地知识助手会从人工整理的知识库匹配排查方向，并把你带到相关课程。它不是生成式 AI，也不会上传问题。

<button type="button" class="md-button md-button--primary" data-open-stm-assistant>立即提问</button>
[了解助手能力](assistant/index.md){ .md-button }

</div>

<div class="assistant-intro__status" markdown>

**隐私友好**

无需登录，不需要 API 密钥；对话只保存在当前浏览器，可以随时清空。

</div>

</div>

## 第一阶段课程

```mermaid
flowchart LR
  A[环境搭建] --> B[第一个工程]
  B --> C[GPIO]
  C --> D[EXTI]
  D --> E[UART]
  E --> F[TIM / PWM]
  F --> G[ADC / DMA]
  G --> H[I²C]
  H --> I[SPI]
  I --> J[多外设数据记录器]
```

| 课程 | 可见成果 | 建议时间 |
|---|---|---:|
| [环境搭建](getting-started/environment.md) | IDE、驱动和板卡连接正常 | 45–90 分钟 |
| [第一个工程](getting-started/first-project.md) | 可编译、下载、单步调试 | 60–90 分钟 |
| [GPIO](courses/gpio.md) | LED 闪烁、读取按键 | 60 分钟 |
| [EXTI](courses/exti.md) | 按键中断可靠触发 | 75 分钟 |
| [UART](courses/uart.md) | 串口收发与日志输出 | 90 分钟 |
| [TIM/PWM](courses/tim-pwm.md) | 无阻塞节拍与呼吸灯 | 90 分钟 |
| [ADC/DMA](courses/adc-dma.md) | 连续采样、平均值与缓冲区 | 90–120 分钟 |
| [I²C](courses/i2c.md) | 读取传感器并定位无应答 | 90 分钟 |
| [SPI](courses/spi.md) | 完成一次可验证的全双工事务 | 90 分钟 |

## 本机学习进度

<div class="progress-panel"></div>

!!! info "进度保存在哪里？"
    进度只写入当前浏览器的 `localStorage`，不会上传。你可以随时导出 JSON 备份，或在另一浏览器导入。

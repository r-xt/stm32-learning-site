---
title: STM32 本地知识助手
hide:
  - toc
---

# STM32 本地知识助手

<div class="assistant-intro" markdown>

<div markdown>

## 随时提问，快速找到排查方向

助手覆盖 STM32 入门、GPIO、EXTI、UART、定时器、ADC、DMA、I²C、SPI、RTOS、C 语言和常见计算机基础知识。它会从本站人工整理的本地知识库匹配答案，并给出相关课程入口。

<button type="button" class="md-button md-button--primary" data-open-stm-assistant>打开本地知识助手</button>

</div>

<div class="assistant-intro__status" markdown>

**本地知识库版**

- 无需注册或 API 密钥
- 问题与对话不会上传
- 本地和 GitHub Pages 均可使用
- 重点课程和故障主题附有 ST 官方来源入口
- 不调用联网模型，不产生 API 费用

</div>

</div>

## 可以问什么

<div class="card-grid" markdown>

<div class="card" markdown>
### 外设与调试
串口乱码、LED 不亮、下载失败、中断优先级、定时器频率和 HardFault 排查。
</div>

<div class="card" markdown>
### 嵌入式基础
DMA、RTOS、看门狗、低功耗、Bootloader、HAL/LL 与寄存器开发。
</div>

<div class="card" markdown>
### 计算机知识
C 指针、栈与堆、二进制、十六进制、位运算、并发与阻塞设计。
</div>

</div>

## 推荐提问方式

描述越具体，匹配越准确。建议包含：

```text
芯片或板卡：STM32F103C8T6 / 某开发板
使用外设：USART1
现象：115200 波特率收到乱码
已经检查：串口工具为 8N1，时钟使用外部 8 MHz 晶振
问题：下一步应该检查什么？
```

也可以直接问：

- “程序下载失败怎么排查？”
- “中断函数里为什么不建议延时？”
- “PWM 频率和占空比怎么计算？”
- “volatile 能保证线程安全吗？”
- “HardFault 应该看哪些寄存器？”

## 知识从哪里来

当前版本不是实时读取全部 ST 文档的生成式 AI。知识库由本站课程、通用嵌入式知识和经过筛选的官方资料摘要人工整理而成；重要主题会附上 ST、Arm 或 FreeRTOS 的官方入口。由于它只包含已经写入的条目，未覆盖的问法或过于简短的问题可能无法正确匹配。

本站以 STM32F103C8T6 作为当前可追溯基线，集中入口见 [F103C8T6 官方资料索引](../resources/f103-official-docs.md)。索引列出了 DS5319、RM0008、PM0056、ES096，以及每节课程应该核对的章节关键词。

本站只采用本地扩展方式：

1. 为一个明确问题增加经过核验的问答和常见说法；
2. 链接对应本站课程或官方资料入口；
3. 区分通用原理与具体系列差异；
4. 对未知问题返回安全提示，不猜测寄存器值、引脚或电气参数。

本站会把“能够从来源确认”放在“什么问题都生成一个答案”之前。

!!! info "为什么不直接连接大模型？"
    本站选择保持免费、可离线和隐私友好。助手不需要服务器，不保存 API 密钥，也不会把你的问题发送到第三方服务。

!!! warning "安全与准确性"
    助手提供学习和排查思路，不替代芯片 Data Sheet、Reference Manual、Errata 或产品安全评审。涉及供电、电气极限、Flash 擦写、固件安全和量产配置时，请核对对应完整型号的最新官方资料。

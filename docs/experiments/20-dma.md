---
title: 实验 20 · DMA 传输
---

# 实验 20 · DMA 实验

**原始工程目标：STM32F103ZE**  
**接线：K1→PB8，D2→PA1；USART1 TX 使用 DMA1 Channel 4**

## 实验目标与现象

程序准备一个 5000 字节缓冲区，全部填入字符 `5`。按下 K1 后，DMA1 通道 4 自动把内存数据送到 USART1 数据寄存器；传输期间 D2 翻转，完成后主循环继续运行。

## 操作步骤

1. 连接 K1、D2 和 USART1，串口设置 9600、8-N-1。
2. 下载后按 K1，串口应收到约 5000 个 `5`。
3. 9600 bit/s 下一个 8-N-1 字符通常占 10 bit，因此 5000 字符理论上约需 5.2 s。
4. 观察 D2 在等待 DMA 完成期间仍闪烁，证明 CPU 不负责逐字节搬运。
5. 在调试器中观察 DMA1 Channel 4 的剩余计数逐渐变为 0。

## 常见问题

| 问题 | 解决方法 |
|---|---|
| 完全没有发送 | 确认 USART1 的 DMA TX 请求已开启，通道映射为 DMA1 Channel 4。 |
| 只发送一部分 | 每次启动前先禁用通道并重新写传输计数，清除 TC4 标志。 |
| 数据重复或错位 | 内存地址应递增，外设地址应固定为 `USART1->DR`。 |
| 程序 RAM 紧张 | 全局缓冲区占 5000 字节；查看 map 文件和目标芯片 SRAM 容量。 |
| 以为 CPU 完全异步 | 原示例仍用循环等待 DMA 完成；工程化版本可用传输完成中断通知主循环。 |

## 专业名词

- **DMA**：无需 CPU 逐次搬运，在外设和内存之间传输数据的控制器。
- **外设地址/内存地址**：本例分别是 USART 数据寄存器和发送缓冲区。
- **Normal 模式**：传完设定数量后停止；Circular 模式会循环重装。
- **TC 标志**：Transfer Complete，传输完成标志。
- **通道映射**：特定外设请求固定连接到特定 DMA 通道。

参考：[AN2548：STM32 DMA 控制器介绍](https://www.st.com/resource/en/application_note/an2548-using-the-stm32f0f1f3cxgxlx-series-dma-controller-stmicroelectronics.pdf)。

[返回实验目录](index.md)


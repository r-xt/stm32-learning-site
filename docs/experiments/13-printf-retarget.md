---
title: 实验 13 · printf 重定向
---

# 实验 13 · `printf` 重定向

**原始工程目标：STM32F103ZE**  
**输出：USART1 PA9，9600 bit/s**

## 实验目标与现象

实现 `fputc()`，让 C 标准库的 `printf()` 逐字符写入 USART1。程序循环输出整数、浮点数、十六进制、八进制和字符串。

## 操作步骤

1. 按实验 12 连接 USB-TTL 并设置 9600、8-N-1。
2. 确认 `usart.c` 中存在 `int fputc(int ch, FILE *p)`，且相关头文件包含 `stdio.h`。
3. 编译下载，串口应周期输出 `data=1234`、`fdata=12.34` 等内容。
4. 将输出改成自己的传感器值，并加 `\r\n` 保证多数串口工具正确换行。

## 常见问题

| 问题 | 解决方法 |
|---|---|
| `printf` 没有任何输出 | 先确认 USART1 单字节发送正常，再检查 `fputc` 是否被链接。 |
| 程序进入半主机错误 | 在 Keil 中正确配置 MicroLIB/禁用 semihosting，具体方式取决于编译器版本。 |
| 浮点数不显示 | 某些精简 C 库默认不含浮点格式，需要开启浮点 `printf`，同时关注 Flash 占用。 |
| 输出很慢、任务被阻塞 | 当前 `fputc` 每字节轮询 TXE；日志量大时用缓冲区、DMA 或降低日志。 |

## 专业名词

- **重定向**：把标准输出的底层字符出口改到串口等设备。
- **`fputc`**：C 库输出一个字符时可调用的底层函数。
- **半主机（Semihosting）**：固件借助调试器使用主机 I/O；脱离调试器可能无法运行。
- **格式化输出**：把二进制数按 `%d`、`%x`、`%f` 等规则转换为文本。

参考：[RM0008 USART 章节](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf)。

[返回实验目录](index.md)


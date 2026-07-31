---
title: RTOS 实验 15 · 固定内存分区
---

# 实验 15 · 用固定大小内存块避免堆碎片

**目标：创建固定内存分区，申请、使用并归还内存块**

!!! danger "原压缩包内容错误"
    本地实验 15 的 `main.c` 与实验 14 完全相同，仍是任务消息队列示例，没有调用 `OSMemCreate()`、`OSMemGet()` 或 `OSMemPut()`。本页给出正确实验框架，并明确不把原包当作内存管理完成版。

## 操作步骤

1. 在配置中启用内存管理功能。
2. 定义对齐良好的静态数组，例如 8 个块、每块 32 字节。
3. 调用 `OSMemCreate()`，传入起始地址、块数量和块大小。
4. 生产任务调用 `OSMemGet()` 取得一块，写入消息后把指针交给消费者。
5. 消费任务处理完毕后调用 `OSMemPut()` 归还同一块。
6. 连续申请 9 次，验证第 9 次失败；归还后应能再次申请。

```c
static CPU_INT08U pool[8][32];
static OS_MEM app_mem;

OSMemCreate(&app_mem, "app_mem", &pool[0][0], 8, 32, &err);
block = OSMemGet(&app_mem, &err);
/* 使用 block */
OSMemPut(&app_mem, block, &err);
```

## 常见问题

| 现象 | 解决方法 |
|---|---|
| 创建内存分区失败 | 检查块大小、块数、对齐和缓冲区总容量。 |
| 很快无块可用 | 为所有异常与超时路径补上 `OSMemPut()`。 |
| 归还后内存损坏 | 只能归还从同一分区取得的块首地址，不能传内部偏移。 |
| 编译仍是消息队列实验 | 原资料打包有误，需要按本页新建内存分区测试。 |

## 专业名词

- **固定内存分区**：由相同大小块组成的预分配内存池。
- **内存碎片**：可用空间被分散成难以利用的小块。
- **确定性**：操作耗时和失败条件具有明确上界。
- **内存对齐**：对象地址满足 CPU 或数据类型要求的边界。

参考：[Micrium Kernel 资源管理指南](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)、[STM32F103ZE 产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)。

[返回 RTOS 实验目录](index.md)


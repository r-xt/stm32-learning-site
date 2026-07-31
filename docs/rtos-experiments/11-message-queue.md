---
title: RTOS 实验 11 · 消息队列
---

# 实验 11 · 用消息队列传递数据

**目标：一个任务发送消息指针和长度，另一个任务按 FIFO 顺序接收**

!!! danger "原压缩包内容错误"
    本地实验 11 的 `main.c` 与实验 10 的 SHA-256 完全相同，内容仍是互斥量示例，并不存在 `OSQCreate()`、`OSQPost()` 或 `OSQPend()`。下面给出应有的实现方法，不能把原包直接当作完成版。

## 操作步骤

1. 在配置中启用消息队列功能，并声明全局 `OS_Q app_q`。
2. 启动任务调用 `OSQCreate(&app_q, "app_q", 8, &err)`。
3. 发送任务准备生命周期足够长的消息，再调用 `OSQPost()`。
4. 接收任务调用阻塞式 `OSQPend()`，取得消息指针、长度和时间戳。
5. 检查消息内容并翻转 LED；快速发送超过 8 条，验证队列满错误。

```c
OSQCreate(&app_q, "app_q", 8, &err);
OSQPost(&app_q, msg_ptr, msg_len, OS_OPT_POST_FIFO, &err);
msg_ptr = OSQPend(&app_q, 0, OS_OPT_PEND_BLOCKING,
                  &msg_len, &timestamp, &err);
```

## 消息内存必须有效

队列通常保存的是指针和长度，不会自动复制指针指向的数据。不要把局部数组地址发送后立即离开函数；可使用静态对象、固定内存池或“接收方处理完再归还”的所有权规则。

## 常见问题

| 现象 | 解决方法 |
|---|---|
| 收到乱码或旧数据 | 检查发送缓冲区是否已失效或被发送方提前改写。 |
| 队列很快满 | 提升消费能力、增大有依据的深度，并处理满队列返回值。 |
| 多个接收者拿到顺序不固定 | 队列保证消息顺序，不保证多个消费者的任务调度顺序。 |
| 编译仍只有互斥量代码 | 这是原资料打包错误，按本页重新创建队列示例。 |

## 专业名词

- **消息队列**：按顺序保存待处理消息的内核对象。
- **FIFO**：先进入队列的消息先被取出。
- **所有权**：约定某一时刻哪个任务负责维护和释放消息内存。
- **背压**：生产速度超过消费速度时，限制、等待或丢弃输入的机制。

参考：[Micrium Kernel 消息队列](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)、[STM32F103ZE 产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103ze.html)。

[返回 RTOS 实验目录](index.md)


# 项目 2 · 串口命令行终端

## 项目目标

实现一个最小但可靠的命令行终端：

```text
help
led on
led off
led toggle
status
```

终端应支持退格、忽略多余空格、拒绝超长命令，并对未知命令返回明确错误。

## 先修课程

[UART](../courses/uart.md)、[GPIO](../courses/gpio.md)和基础 C 字符串处理。

## 架构

```mermaid
flowchart LR
  A[UART IRQ / DMA] --> B[接收环形缓冲]
  B --> C[逐字节行编辑]
  C --> D[命令解析]
  D --> E[命令处理器]
  E --> F[响应输出]
```

接收、解析和业务必须分层。UART 回调只把数据放入缓冲，主循环取出数据并处理，这样耗时命令不会破坏接收时序。

## 第一版约束

- 115200、8-N-1；
- 单条命令最多 63 个可见字符；
- 命令以 `\r` 或 `\n` 结束，连续的 `\r\n` 只执行一次；
- 首版可使用单生产者/单消费者环形缓冲；
- 不在中断中调用 `printf()`、`strtok()` 或阻塞发送。

## 环形缓冲接口

```c
#define RX_BUFFER_SIZE 128U

typedef struct {
  uint8_t data[RX_BUFFER_SIZE];
  volatile uint16_t head;
  volatile uint16_t tail;
  volatile uint32_t dropped;
} RingBuffer;
```

建议提供以下接口，并为“满”和“空”写清返回值：

```c
bool Ring_PushFromISR(RingBuffer *rb, uint8_t byte);
bool Ring_Pop(RingBuffer *rb, uint8_t *byte);
size_t Ring_Count(const RingBuffer *rb);
```

使用一个空槽区分满和空时，可用 `(head + 1) % RX_BUFFER_SIZE == tail` 判断已满。缓冲满时增加 `dropped`，不要静默覆盖未处理数据。

## 行编辑器

主循环逐字节处理：

```c
#define LINE_SIZE 64U
static char line[LINE_SIZE];
static size_t line_len = 0;

static bool LineEditor_Push(uint8_t ch)
{
  if (ch == '\r' || ch == '\n')
  {
    if (line_len == 0U) return false;
    line[line_len] = '\0';
    return true;
  }

  if (ch == '\b' || ch == 0x7FU)
  {
    if (line_len > 0U) line_len--;
    return false;
  }

  if (ch >= 32U && ch <= 126U && line_len < LINE_SIZE - 1U)
    line[line_len++] = (char)ch;

  return false;
}
```

执行完成后必须把 `line_len` 清零。对溢出可选择立即丢弃整行并输出 `ERR line too long`，这比悄悄截断更安全。

## 命令表

避免不断增长的 `if/else`，可以使用静态表：

```c
typedef void (*CommandHandler)(int argc, char **argv);

typedef struct {
  const char *name;
  CommandHandler handler;
  const char *help;
} Command;

static const Command commands[] = {
  { "help",   Cmd_Help,   "help - show commands" },
  { "led",    Cmd_Led,    "led on|off|toggle" },
  { "status", Cmd_Status, "status - show system state" }
};
```

解析时限制 `argc`，不要假设参数一定存在。`led` 没有参数或参数非法时应返回用法说明。

## 测试清单

- [ ] 每个合法命令返回一致的 `OK` 或状态文本。
- [ ] 空行不会重复执行上一条命令。
- [ ] `led`、`led wrong`、超长行和未知命令都有明确错误。
- [ ] 快速粘贴多条命令后缓冲不会损坏；若溢出，`dropped` 可观察。
- [ ] 连续运行 30 分钟，内存使用不增长，终端仍响应。
- [ ] 关闭本地回显后，能分清 MCU 回显与终端自身回显。

## 扩展挑战

- 用 DMA + Idle Line 接收替代单字节中断。
- 为输出增加非阻塞 TX 队列。
- 为配置命令增加范围检查和持久化，并实现 `factory-reset`。


---
title: 05 · UART 串口通信
description: 输出日志并使用中断接收字节
---

# 05 · UART 串口通信

<div class="lesson-progress" data-lesson-id="uart-001" data-lesson-title="UART 串口通信"></div>

## 学习目标

- 配置波特率、数据位、停止位和校验；
- 使用轮询发送建立第一条日志通道；
- 使用中断接收单字节并及时重新挂载；
- 识别接线、参数和数据协议层面的错误。

## 串口参数

通信双方必须使用一致的帧格式。入门常用 `115200, 8-N-1`：115200 bit/s、8 数据位、无校验、1 停止位。

如果使用 Nucleo 的板载虚拟串口，先查板卡 User Manual，确认哪个 USART 实例与 ST-LINK VCP 相连。如果使用 USB 转串口模块，必须共地，并交叉连接 `MCU TX → 模块 RX`、`MCU RX ← 模块 TX`，电平应为 3.3 V TTL 而不是传统 RS-232 电压。

## CubeMX 配置

1. 启用与 VCP 相连的 USART，模式选 Asynchronous。
2. 设置 `115200 / 8 bits / None / 1 stop bit`。
3. 为 TX/RX 引脚设置易读标签（可选）。
4. 若做中断接收，在 NVIC 中启用该 USART 全局中断。
5. 生成代码并确认初始化函数返回 `HAL_OK`。

## 先发送一行文本

```c
static const uint8_t hello[] = "STM32 ready\r\n";

HAL_UART_Transmit(&huart2, (uint8_t *)hello, sizeof(hello) - 1U, 100U);
```

Windows 串口终端通常使用 `\r\n` 换行。超时时间不是发送间隔，而是 HAL 最多愿意阻塞等待多久。

## 中断接收并回显

在用户变量区：

```c
uint8_t rx_byte;
volatile uint8_t rx_ready = 0;
```

初始化完成后启动第一次接收：

```c
HAL_UART_Receive_IT(&huart2, &rx_byte, 1U);
```

在回调中保存事件并重新挂载接收：

```c
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
  if (huart->Instance == USART2)
  {
    rx_ready = 1;
    HAL_UART_Receive_IT(&huart2, &rx_byte, 1U);
  }
}
```

主循环中处理数据：

```c
if (rx_ready)
{
  rx_ready = 0;
  HAL_UART_Transmit(&huart2, &rx_byte, 1U, 20U);
}
```

!!! note "这个例子为什么只适合入门？"
    单字节共享变量在连续高速输入时可能被覆盖。真正的命令行项目应使用环形缓冲、DMA 或消息队列，把接收和解析解耦。

## 验收方法

1. 打开串口终端并选择正确 COM 口。
2. 复位板卡，看到 `STM32 ready`。
3. 输入字符，终端收到相同字符。
4. 故意把终端波特率改错，观察乱码，然后恢复参数。

## 故障排查

| 现象 | 检查顺序 |
|---|---|
| 没有 COM 口 | ST-LINK VCP 驱动、USB 接口、板卡手册 |
| 有 COM 口但没输出 | USART 实例、引脚复用、TX/RX 通路、波特率 |
| 输出乱码 | 双方波特率、系统时钟、帧格式、电平标准 |
| 只能收到第一个字节 | 回调中是否重新调用 `HAL_UART_Receive_IT` |
| 偶尔丢字节 | 阻塞处理过长，应改环形缓冲或 DMA |

## 练习

- 收到字符 `1` 时点亮 LED，收到 `0` 时熄灭。
- 为接收函数的返回值添加检查；若启动失败，通过 LED 或调试变量报告错误。
- 记录一帧 UART 的理论传输时间：115200、8-N-1 下一个字节通常占 10 bit。

## 下一步

[用硬件定时器产生稳定节拍与 PWM →](tim-pwm.md)


# 板卡选择

第一块板的核心标准是：官方资料完整、板载调试器可用、接口容易测量。不要只按主频或 Flash 容量选择。

| 学习方向 | 建议起点 | 说明 |
|---|---|---|
| 经典入门 | NUCLEO-F103RB | 教程多，适合理解经典 F1 外设，但架构较老 |
| 现代主流入门 | NUCLEO-G071RB | 成本友好，适合从现代 STM32 主流系列开始 |
| 低功耗 | L4/U5 系列 Nucleo | 进入 Stop/Standby、功耗测量和更强安全能力 |
| 高性能 | H5/H7 系列 Nucleo | Cache、复杂 DMA、外部存储和性能分析 |
| 无线 | WB/WBA/WL 系列开发板 | BLE、802.15.4、Sub-GHz 等专题 |

## 购买前核对

1. 在 [ST 产品选择器](https://www.st.com/en/evaluation-tools/stm32-mcu-mpu-eval-tools.html)确认状态和替代型号。
2. 下载 Board User Manual，确认 LED、按键、VCP、Arduino/Morpho 接口。
3. 检查板载 ST-LINK 是否支持虚拟串口，以及它连接到哪个 UART。
4. 确认 USB 接头和线材，必要时准备独立 USB 转串口模块。
5. 预留万用表、逻辑分析仪、面包板和 3.3 V 兼容传感器预算。

## 文档优先级

| 文档 | 首先回答的问题 |
|---|---|
| Board User Manual | 板上器件如何连接、跳线怎样设置？ |
| MCU Data Sheet | 引脚、电气限制、外设资源和封装是什么？ |
| Reference Manual | 外设寄存器和工作机制是什么？ |
| Programming Manual | Cortex-M 内核、中断和指令相关行为是什么？ |
| Errata Sheet | 这颗芯片已知哪些硬件限制？ |


# 资源中心

学习 STM32 时优先使用原始资料。本站提供学习顺序和解释，不复制分发官方 PDF；离线构建不会把下列外部网站自动保存到本机。

## ST 官方入口

- [STM32F103C8T6 官方资料索引](f103-official-docs.md)：本站课程使用的 DS5319、RM0008、PM0056、ES096 与专题应用笔记
- [STM32 32 位 MCU 产品与文档入口](https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html)
- [STM32Cube 软件生态](https://www.st.com/stm32cube)
- [STM32CubeIDE](https://www.st.com/en/development-tools/stm32cubeide.html)
- [STM32CubeMX](https://www.st.com/en/development-tools/stm32cubemx.html)
- [STM32CubeProgrammer](https://www.st.com/en/development-tools/stm32cubeprog.html)
- [STMicroelectronics GitHub 组织](https://github.com/STMicroelectronics)
- [ST Community](https://community.st.com/)

## Arm 与 RTOS

- [Arm CMSIS 文档](https://arm-software.github.io/CMSIS_6/latest/General/index.html)
- [FreeRTOS 官方文档](https://www.freertos.org/Documentation/00-Overview)

## 怎样阅读一颗 MCU 的资料

1. **板卡 User Manual**：先弄清板上连接、跳线和调试接口。
2. **Data Sheet**：确认电气限制、封装引脚、复用功能和外设数量。
3. **Reference Manual**：理解 RCC、GPIO、USART、TIM 等外设行为。
4. **Programming Manual**：理解 Cortex-M 内核、异常和 NVIC。
5. **Errata Sheet**：在定版或排查异常前检查已知硬件问题。
6. **Application Note / Cube 示例**：把原理落到特定应用，但仍需核对系列和版本。

## 引用记录模板

实验记录中不要只写“参考官方手册”，建议记录：

```text
文档编号：RMxxxx
文档版本与日期：Rev x / YYYY-MM-DD
章节或页码：USART / Baud rate generation
用于回答的问题：为什么实测波特率偏差过大？
结论：……
```

!!! warning "资料会更新"
    工具版本、芯片状态、勘误和安全建议会变化。开始新项目或准备量产时，应重新访问产品页确认最新文档，而不是只依赖本地旧副本。

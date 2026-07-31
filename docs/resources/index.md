# 资源中心

学习 STM32 时优先使用原始资料。本站提供学习顺序和解释，不复制分发官方 PDF；离线构建不会把下列外部网站自动保存到本机。

## 本地资料整理成果

这些文章根据你提供的 `3--STM32相关资料` 与 `4--STM32固件库` 整理。原 PDF、书籍和源码包保留在本地，不随公开网站发布。

- [STM32F10x 标准外设库 V3.5 使用指南](firmware-library-v35.md)：目录结构、建工程、驱动添加、常见链接错误与迁移建议。
- [Cortex-M3 资料学习指南](cortex-m3-guide.md)：用向量表、NVIC、SysTick 和 HardFault 小项目消化内核知识。
- [STM32F10x Flash 编程实践](flash-programming-guide.md)：参数页、擦写、校验、掉电安全和磨损均衡。
- [CAN 资料与实操指南](can-learning-guide.md)：把通用 CAN 协议知识落到 STM32 双节点实验。
- [STM32 选型资料使用指南](mcu-selection-guide.md)：说明 2015 旧手册的用途和当前选型核对流程。
- [uC/OS 资料库阅读与版本指南](ucos-reference-guide.md)：区分 II/III、版本、端口、配置和许可。
- [uC/OS-III 16 个独立实验](../rtos-experiments/index.md)：每个项目一篇实现与排错文章。

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

# 开发工具

## 基础工具链

| 工具 | 主要职责 | 何时使用 |
|---|---|---|
| [STM32CubeIDE](https://www.st.com/en/development-tools/stm32cubeide.html) | 配置、代码生成、编辑、编译、GDB 调试 | 入门主工具 |
| [STM32CubeMX](https://www.st.com/en/development-tools/stm32cubemx.html) | 独立引脚/时钟/中间件配置和代码生成 | 使用其他 IDE 或独立配置流程时 |
| [STM32CubeProgrammer](https://www.st.com/en/development-tools/stm32cubeprog.html) | 烧录、验证、Option Bytes 和连接诊断 | 独立烧录与底层排查 |
| 串口终端 | 查看日志、发送命令 | 从 UART 课程开始 |
| Git | 保存可追踪的工程版本 | 从第一个工程开始 |

## 仪器优先级

1. **万用表**：先确认供电、电平和通断。
2. **逻辑分析仪**：观察 UART/I²C/SPI/CAN 数字时序。
3. **示波器**：测量模拟信号、边沿质量、PWM 和电源噪声。
4. **电流测量工具**：进入低功耗课程后评估真实功耗。

## 工程习惯

- 工具版本、MCU 固件包版本和板卡版本写入项目 README。
- `.ioc`、源代码、链接脚本和必要配置进入 Git；编译产物通常忽略。
- 升级工具链后先用独立分支构建并验证，不在临近交付时盲目更新。
- 遇到问题保留完整构建日志，不只截取最后一行。


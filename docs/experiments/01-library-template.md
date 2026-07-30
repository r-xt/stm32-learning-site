---
title: 实验 01 · 库函数模板创建
---

# 实验 01 · 库函数模板创建

**原始工程目标：STM32F103C8，Medium-density**  
**源码入口：`1. 库函数模板创建/1. 库函数模板创建/Template.uvprojx`**

## 实验目标

建立一个能够正确编译、下载和进入 `main()` 的 STM32F10x 标准外设库工程。原始工程使用 **Standard Peripheral Library V3.5.0**，不是 HAL 库。

## 工程里已经配置了什么

| 项目 | 原始配置 |
|---|---|
| Device | `STM32F103C8` |
| 预处理宏 | `USE_STDPERIPH_DRIVER, STM32F10X_MD` |
| 启动文件 | `startup_stm32f10x_md.s` |
| 包含路径 | `User`、`Libraries/CMSIS`、标准外设库 `inc` |
| 已加入的驱动 | `stm32f10x_gpio.c`、`stm32f10x_rcc.c` |

## 操作步骤

1. 用 Keil µVision 打开 `Template.uvprojx`。
2. 打开 **Options for Target → C/C++**，核对 Define 和 Include Paths 与上表一致。
3. 在工程树中确认 `Startup` 组使用 `_md.s`，不要误选 `_hd.s`。
4. 打开 `User/main.c`；源文件只有一个空的无限循环，这是正常的最小模板。
5. 点击 Build。编译成功后连接 ST-LINK，在 Debug 设置中选择 SWD。
6. 下载程序并进入调试，给 `main()` 下断点；能够停住即证明启动文件、链接脚本和调试链路正常。

## 常见问题

| 问题 | 原因与解决方法 |
|---|---|
| `stm32f10x.h` 找不到 | Include Paths 不完整，补上 `User`、CMSIS 和驱动库 `inc`。 |
| 大量外设函数未定义 | 只加入了头文件，没有把对应的 `stm32f10x_xxx.c` 加入工程。 |
| 启动后进入 HardFault | 芯片型号、启动文件或密度宏不一致；C8 应使用 `STM32F10X_MD` 和 `_md.s`。 |
| 下载提示 No Target | 检查 3.3 V、GND、SWDIO、SWCLK、NRST，并尝试 Connect under Reset。 |
| Keil 要求安装 Device Pack | 安装 STM32F1 对应 DFP，或者重新选择正确设备。 |

## 专业名词

- **CMSIS**：Arm 为 Cortex-M 提供的统一内核接口，包括寄存器定义、内核函数和启动支持。
- **启动文件**：复位后最先执行的汇编代码，包含中断向量表并最终调用 C 运行库和 `main()`。
- **Medium-density**：STM32F1 中 Flash 为 64–128 KB 的密度分类；F103C8 属于此类。
- **预处理宏**：编译前控制条件代码的符号，密度宏会决定可见的中断和外设定义。
- **链接**：把多个目标文件组合成最终固件，并把代码、常量、变量放入正确的 Flash/RAM 地址。

## 核对资料

- [STM32F103C8 产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html)
- [RM0008 参考手册](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf)
- [PM0056 Cortex-M3 编程手册](https://www.st.com/resource/en/programming_manual/cd00228163-stm32f10xxx20xxx21xxxl1xxxx-cortexm3-programming-manual-stmicroelectronics.pdf)

[返回实验目录](index.md)


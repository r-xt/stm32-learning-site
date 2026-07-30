---
title: 02 · 第一个工程
description: 从板卡选择到断点调试，建立最小开发闭环
---

# 02 · 第一个工程

<div class="lesson-progress" data-lesson-id="first-project-001" data-lesson-title="第一个工程"></div>

## 学习目标

- 从板卡或 MCU 型号创建工程；
- 理解 `.ioc`、`Core`、`Drivers` 等主要目录；
- 完成生成、编译、下载、运行和断点调试；
- 知道用户代码应该写在哪些保留区。

## 创建工程

=== "使用 Nucleo 板"

    1. 选择 **File → New → STM32 Project**。
    2. 打开 **Board Selector**，输入完整板卡型号。
    3. 选中板卡，创建工程，并接受初始化外设的建议。

=== "使用自制板/核心板"

    1. 打开 **MCU/MPU Selector**。
    2. 输入芯片完整料号，核对封装和 Flash/RAM 容量。
    3. 创建工程后手动配置 RCC、SYS 和所需引脚。

工程名建议只使用英文字母、数字、短横线或下划线，例如 `01_blinky`。

## 认识工程结构

| 路径 | 作用 | 是否直接修改 |
|---|---|---|
| `project.ioc` | 引脚、时钟、外设和代码生成配置 | 通过图形界面修改 |
| `Core/Inc` | 应用头文件 | 可以，优先写在用户区 |
| `Core/Src/main.c` | 初始化入口和主循环 | 可以，只写在 `USER CODE` 区域 |
| `Drivers/CMSIS` | Cortex-M 与设备定义 | 通常不改 |
| `Drivers/STM32xx_HAL_Driver` | HAL 驱动 | 通常不改 |
| `Debug` 或 `Release` | 编译产物 | 不手工维护 |

!!! danger "保护用户代码"
    再次生成代码时，生成器只保证保留 `/* USER CODE BEGIN ... */` 与对应 `END` 之间的内容。不要把业务逻辑散落到自动生成区。

## 建立最小循环

在 `while (1)` 的用户代码区暂时加入计数变量，便于观察调试：

```c
/* USER CODE BEGIN 2 */
volatile uint32_t loop_count = 0;
/* USER CODE END 2 */

/* Infinite loop */
/* USER CODE BEGIN WHILE */
while (1)
{
  loop_count++;
  HAL_Delay(100);
  /* USER CODE END WHILE */

  /* USER CODE BEGIN 3 */
}
/* USER CODE END 3 */
```

`volatile` 让编译器保留对变量的实际访问，方便调试器观察；它不是线程同步工具。

## 编译、下载和调试

1. 保存 `.ioc` 并生成代码。
2. 点击锤子图标编译，确认控制台显示 0 errors。
3. 在 `loop_count++` 所在行双击左侧边栏添加断点。
4. 点击 Debug，首次出现调试配置时保留默认 ST-LINK 设置。
5. 程序在 `main()` 或断点处停止后，使用 Resume、Step Over 和 Variables 观察变量。
6. 停止调试，再按板卡复位键确认程序可独立运行。

## 验收清单

- [ ] 工程从 `.ioc` 重新生成后仍能编译。
- [ ] 调试器能下载程序且控制台没有验证错误。
- [ ] 断点可以命中，`loop_count` 持续增加。
- [ ] 退出调试、复位后程序仍会运行。

## 常见故障

| 现象 | 优先检查 |
|---|---|
| `No ST-LINK detected` | USB 数据线、接口、驱动、设备管理器 |
| `No target found` | 供电、跳线、目标芯片选择、Connect under reset |
| 编译找不到头文件 | 文件是否在工程内、Include Path、文件名大小写 |
| 修改后运行行为没变化 | 是否重新编译和下载、当前 Debug 配置是否指向该工程 |

## 练习

把延时分别改为 10 ms 和 500 ms，观察 `loop_count` 的增长速度；然后尝试设置条件断点 `loop_count == 10`。

## 官方资料与核对路径

| 文档 | 本课用途 |
|---|---|
| [UM2553 · STM32CubeIDE quick start guide](https://www.st.com/resource/en/user_manual/um2553-stm32cubeide-quick-start-guide-stmicroelectronics.pdf) | 创建、构建和调试第一个工程 |
| [UM2576 · STM32CubeIDE ST-LINK GDB server](https://www.st.com/resource/en/user_manual/dm00613038-stm32cubeide-st-link-gdb-server-stmicroelectronics.pdf) | 查询连接模式、复位方式和调试日志 |
| [STM32CubeF1 官方仓库](https://github.com/STMicroelectronics/STM32CubeF1) | 核对 HAL、CMSIS 和官方板卡示例的目录结构 |

使用 F103C8T6 时，还应从 [官方资料索引](../resources/f103-official-docs.md)确认 DS5319、RM0008 和 ES096。

## 下一步

[使用 GPIO 控制真实引脚 →](../courses/gpio.md)

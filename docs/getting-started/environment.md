---
title: 01 · 环境搭建
description: 安装 STM32CubeIDE，确认 ST-LINK 和开发板连接
---

# 01 · 环境搭建

<div class="lesson-progress" data-lesson-id="environment-001" data-lesson-title="环境搭建"></div>

## 学习目标

完成本课后，你能够：

- 安装并启动 STM32CubeIDE；
- 让电脑识别板载 ST-LINK；
- 找到板卡和芯片对应的官方文档；
- 区分配置、编译、下载和调试四个动作。

## 需要的软件

| 工具 | 本阶段用途 | 官方入口 |
|---|---|---|
| STM32CubeIDE | 配置外设、生成代码、编译和调试 | [ST 官方页面](https://www.st.com/en/development-tools/stm32cubeide.html) |
| STM32CubeProgrammer | 独立烧录、读写 Flash、检查连接 | [ST 官方页面](https://www.st.com/en/development-tools/stm32cubeprog.html) |
| STM32CubeMX | 独立图形化配置工具；CubeIDE 已集成主要能力 | [ST 官方页面](https://www.st.com/en/development-tools/stm32cubemx.html) |

!!! note "CubeIDE 有两种界面路线"
    截至 2026 年，ST 官方同时提供基于 Eclipse 的 STM32CubeIDE 和基于 VS Code 的 STM32CubeIDE 版本。本课程的菜单名称按 Eclipse 版本编写；使用 VS Code 版本时，芯片配置、编译和调试的核心流程相同，但界面位置会不同。

!!! tip "第一阶段只装什么？"
    先安装 STM32CubeIDE 即可。只有在 IDE 无法识别调试器、需要独立烧录或检查 Option Bytes 时，再安装 CubeProgrammer。

## 安装步骤

1. 从 ST 官方页面下载 Windows 安装包。页面可能要求登录 myST。
2. 关闭正在运行的开发工具，以管理员身份启动安装器。
3. 保留 ST-LINK、J-Link 等驱动组件的默认选择。
4. 安装完成后启动 CubeIDE，为工作区选择一个不含中文和特殊符号的短路径，例如 `C:\STM32\workspace`。
5. 第一次新建工程时，若工具提示下载芯片固件包，允许下载对应系列的软件包。

## 连接开发板

1. 使用板载 ST-LINK 对应的 USB 接口，不要误接 USB OTG/用户接口。
2. 确认电源指示灯亮起。
3. 打开 Windows“设备管理器”，检查是否出现 ST-LINK 调试接口和虚拟串口。
4. 在 CubeIDE 中选择 **Run → Debug Configurations**，确认调试探针可被枚举。

## 快速验证

满足以下条件即可进入下一课：

- CubeIDE 正常启动且能够打开新建 STM32 工程向导；
- 板卡连接后没有“未知 USB 设备”；
- 能在 ST 产品页找到板卡 User Manual 和目标 MCU Data Sheet；
- 知道你的板载 LED 和用户按键对应哪个引脚。

## 常见问题

??? question "电脑完全没有发现新设备"
    优先更换一根确认能传数据的 USB 线，再换 USB 端口。很多“充电线”没有数据线芯。

??? question "ST-LINK detected，但连接目标失败"
    确认板卡跳线保持出厂位置；降低调试频率；尝试 **Connect under reset**。如果旧程序进入低功耗或重新配置了 SWD 引脚，复位下连接尤其重要。

??? question "下载页面或固件包不可用"
    检查 myST 登录状态、代理和安全软件。不要从不明网盘获取修改过的安装包。

## 课后练习

- 写下板卡完整型号、MCU 型号和 LED 引脚。
- 收藏对应的 User Manual、Data Sheet 和 Reference Manual 页面。
- 在 CubeIDE 中找到编译、运行、调试和停止按钮，但暂时不要创建复杂工程。

## 官方资料与核对路径

| 文档 | 本课用途 |
|---|---|
| [UM2563 · STM32CubeIDE installation guide](https://www.st.com/resource/en/user_manual/dm00603964-stm32cubeide-stmicroelectronics.pdf) | 按操作系统核对安装要求与步骤 |
| [UM2553 · STM32CubeIDE quick start guide](https://www.st.com/resource/en/user_manual/um2553-stm32cubeide-quick-start-guide-stmicroelectronics.pdf) | 认识工作区、工程、构建和调试入口 |
| [UM2609 · STM32CubeIDE user guide](https://www.st.com/resource/en/user_manual/um2609-stm32cubeide-user-guide-stmicroelectronics.pdf) | 遇到界面或调试配置问题时查询完整说明 |

资料编号和版本核验方法见 [STM32F103C8T6 官方资料索引](../resources/f103-official-docs.md)。

## 下一步

[创建第一个可调试工程 →](first-project.md)

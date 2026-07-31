---
title: uC/OS 资料库阅读与版本指南
---

# uC/OS 学习资料库：先分版本，再查 API

本地 `UCOS学习资料` 同时包含 uC/OS-II、uC/OS-III V3.03.00 源码、934 页的 uC/OS-III STM32 书籍、中文翻译、配置说明、思维导图和移植文章。它们可以辅助理解，但不能混成同一套 API。

## 推荐阅读顺序

1. 先完成本站 [uC/OS-III 16 个实验](../rtos-experiments/index.md)，建立可观察现象。
2. 用 `os.h` 中的 `OS_VERSION` 锁定源码版本；本批实验为 30300，即 V3.03.00。
3. 阅读本地 uC/OS-III 书籍的任务、时间、信号量、互斥量、队列、定时器和内存分区章节。
4. 用 `os_cfg.h`、`os_cfg_app.h` 检查功能是否编译启用。
5. 最后阅读调度算法、初始化源码和 uC/OS-II 资料做比较，不要直接复制不同版本函数签名。

## 做一个版本审计表

| 项目 | 应记录内容 |
|---|---|
| 内核 | uC/OS-II 或 III、准确版本号、来源 |
| 端口 | CPU 架构、编译器、汇编端口文件 |
| 配置 | tick 频率、定时器频率、最大优先级、启用的服务 |
| 许可 | 源码与商业使用许可、项目是否允许公开再分发 |
| 证据 | 能编译的 commit/压缩包哈希、板卡型号和测试结果 |

## 常见问题

| 问题 | 解决方法 |
|---|---|
| 文档 API 与源码参数不同 | 以本工程 `os.h` 的声明为准，再查同版本文档。 |
| uC/OS-II 示例放进 III 不能编译 | 先理解对象与错误类型差异，按 III API 重写。 |
| 定时器周期差 10 倍 | 区分系统 tick 与 `OS_CFG_TMR_TASK_RATE_HZ`。 |
| 想把整个资料库上传 GitHub | 先核对每个文件的版权与许可；本站只发布原创整理和官方链接。 |
| 新版本文档类型变成 `RTOS_ERR` | Silicon Labs 当前 Micrium OS 与老 V3.03.00 有接口差异，不要机械替换。 |

## 专业名词

- **内核版本**：决定 API、配置项、错误类型和内部结构的具体发布版本。
- **编译裁剪**：通过配置宏只编入项目实际使用的内核功能。
- **端口层**：与 CPU、编译器和上下文切换相关的适配代码。
- **许可合规**：按权利人许可决定能否复制、修改、商用或公开分发。

参考：[Silicon Labs Micrium OS Kernel 文档](https://docs.silabs.com/micrium/latest/micrium-kernel/)、[Kernel Programming Guide](https://docs.silabs.com/micrium/latest/micrium-kernel/04-kernel-programming-guide)。

[返回资源中心](index.md)

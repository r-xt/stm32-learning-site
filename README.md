# STM32 学习站

一个可在 Windows 本地运行、构建后可离线浏览的 STM32 中文学习网站。内容从环境搭建、GPIO、EXTI、UART、TIM/PWM 开始，并提供学习路线、板卡工具、两个项目指南和浏览器本地进度记录。

## 最快启动（Windows）

双击根目录的 `启动网站.cmd`。脚本会在首次运行时：

1. 创建独立的 `.venv` Python 环境；
2. 安装 `requirements.txt` 中的 MkDocs Material；
3. 启动本地网站并打开 `http://127.0.0.1:8000/`。

首次安装依赖需要网络连接，以后可离线启动。停止服务时回到命令窗口按 `Ctrl+C`。

也可以在 PowerShell 中运行：

```powershell
.\scripts\serve.ps1
```

若系统限制脚本执行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

## 构建离线版

双击 `构建离线版.cmd`，或运行：

```powershell
.\scripts\build.ps1
```

构建过程会执行 MkDocs 严格模式和本站检查器。成功后：

- `site\index.html`：直接双击即可离线浏览；
- `dist\stm32-learning-site-offline.zip`：可复制、备份或发到另一台电脑解压浏览。

## 学习内容

- 6 篇入门课程：环境、第一个工程、GPIO、EXTI、UART、TIM/PWM；
- 2 个项目指南：LED 与按键控制器、串口命令行终端；
- 入门、进阶、专家、大师四级路线；
- 板卡选择、工具说明、官方资源与课程模板；
- 本地学习进度、JSON 导出和导入。

## 维护

源内容位于 `docs/`，导航和主题配置位于 `mkdocs.yml`。不要编辑自动生成的 `site/`。新增课程前阅读网站内的“维护 → 课程模板”和“维护说明”。

详细研究背景保留在 `deep-research-report.md`，它不是网站运行依赖。


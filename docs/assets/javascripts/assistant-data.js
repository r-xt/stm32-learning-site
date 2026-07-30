window.STM32_ASSISTANT_KNOWLEDGE = {
  version: 3,
  quickQuestions: [
    "STM32 应该从哪里开始学？",
    "程序下载失败怎么排查？",
    "串口出现乱码怎么办？",
    "ADC 读数为什么不稳定？",
    "I2C 设备不应答怎么查？",
    "SPI 为什么总是读到 0xFF？"
  ],
  entries: [
    {
      title: "STM32 学习顺序",
      keywords: ["怎么学", "学习顺序", "学习路线", "从哪里开始", "入门", "新手", "零基础"],
      answer: [
        "本站统一顺序是“环境与调试 → GPIO → EXTI → UART → 定时器/PWM → ADC/DMA → I²C → SPI → 项目实战”。每一步都要保留一个可观察结果，例如 LED、串口日志或仪器波形。",
        "先完成 01～09 课程，再依次完成 LED 与按键控制器、串口命令行终端和多外设数据记录器；之后再进入 RTOS、低功耗与 Bootloader。"
      ],
      links: [
        ["学习入口", "getting-started/"],
        ["完整学习路线", "tracks/"]
      ]
    },
    {
      title: "选择 STM32 板卡",
      keywords: ["选板", "板卡", "开发板", "f103", "f4", "g0", "h7", "nucleo", "最小系统"],
      answer: [
        "入门优先选择资料多、带板载 ST-LINK、原理图公开的 NUCLEO 或常见教学板。先确认芯片完整型号、调试接口、LED/按键引脚和供电方式。",
        "板卡并非越强越好。GPIO、UART、定时器等基础内容在多数系列上相通；选择与你课程和示例一致的型号能减少迁移成本。"
      ],
      links: [["板卡选择指南", "boards/"]]
    },
    {
      title: "开发环境选择",
      keywords: ["cubeide", "cubemx", "keil", "iar", "ide", "开发环境", "工具链", "编译器"],
      answer: [
        "初学者可以使用 STM32CubeIDE：它集成工程生成、编译、下载和调试。CubeMX 负责时钟、引脚和外设初始化，但生成代码后仍要理解关键配置。",
        "Keil、IAR 和 GCC 都能完成开发。团队项目应统一编译器版本、优化等级和依赖，避免“在我的电脑上能编译”。"
      ],
      links: [["环境搭建", "getting-started/environment/"]]
    },
    {
      title: "下载或连接失败",
      keywords: ["下载失败", "连接失败", "找不到芯片", "st-link", "stlink", "no target", "cannot connect", "烧录失败"],
      answer: [
        "先按顺序检查：开发板是否供电、USB 线是否支持数据、ST-LINK 驱动是否正常、SWDIO/SWCLK/GND 是否可靠、工程选择的芯片型号是否准确。",
        "如果用户程序关闭了调试口或立即进入低功耗，可尝试降低 SWD 频率，并使用 Connect under reset。仍失败时检查 BOOT 配置、复位脚和目标电压。"
      ],
      links: [
        ["第一个工程与调试", "getting-started/first-project/"],
        ["ST UM2576 调试连接手册", "https://www.st.com/resource/en/user_manual/dm00613038-stm32cubeide-st-link-gdb-server-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "GPIO 基础与配置",
      keywords: ["gpio", "gpio是什么", "通用输入输出", "输入模式", "输出模式", "推挽", "开漏", "alternate function", "复用功能", "moder", "otyper"],
      answer: [
        "GPIO 是通用输入/输出引脚。STM32 的每个 GPIO 通常可以独立配置为输入、普通输出、模拟或复用功能；输入可选择浮空、上拉或下拉，输出和复用功能还可选择推挽或开漏。",
        "排查 GPIO 时按这个顺序：确认完整芯片型号和原理图引脚 → 开启对应 GPIO 端口时钟 → 设置模式、上下拉、输出类型和速度 → 确认复用编号 → 读取 IDR/ODR 等寄存器并测量实际电平。不同系列的寄存器细节和电气限制应以该型号 Data Sheet 与 Reference Manual 为准。"
      ],
      links: [
        ["本站 GPIO 课程", "courses/gpio/"],
        ["ST 官方 GPIO 入门", "https://wiki.st.com/stm32mcu/wiki/Getting_started_with_GPIO"],
        ["ST AN4899 GPIO 应用笔记", "https://www.st.com/resource/en/application_note/dm00315319-stm32-gpio-configuration-for-hardware-settings-and-low-power-consumption-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "程序运行但 LED 不亮",
      keywords: ["led不亮", "灯不亮", "gpio没反应", "gpio不工作", "引脚不输出"],
      answer: [
        "确认 LED 的实际引脚和有效电平。很多板载 LED 是低电平点亮，原理图比示例代码更可靠。",
        "再检查 GPIO 端口时钟、输出模式、上下拉、速度和初始化顺序。用断点查看 ODR/IDR 寄存器，并用万用表测量引脚电压，区分软件问题和硬件连接问题。"
      ],
      links: [["GPIO 输入输出", "courses/gpio/"]]
    },
    {
      title: "GPIO 上拉与下拉",
      keywords: ["上拉", "下拉", "浮空", "pullup", "pulldown", "输入不稳定"],
      answer: [
        "输入引脚没有确定电平时会浮空，容易受噪声影响。上拉让默认电平为高，下拉让默认电平为低。",
        "选择内部还是外部电阻要结合速度、功耗和抗干扰要求。机械按键通常还需要消抖，不能只依赖上下拉。"
      ],
      links: [["GPIO 输入输出", "courses/gpio/"]]
    },
    {
      title: "按键消抖",
      keywords: ["消抖", "按键抖动", "一次按下多次", "debounce"],
      answer: [
        "机械触点在按下和释放时会快速反复跳变。常用软件方法是检测到变化后等待 10–30 ms，再次采样确认；更好的方法是周期采样并使用状态机。",
        "不要在中断服务函数里长时间延时。中断只记录事件或时间戳，消抖与业务逻辑放到主循环或任务中处理。"
      ],
      links: [
        ["EXTI 外部中断", "courses/exti/"],
        ["ST RM0008 外设参考手册", "https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "中断与轮询",
      keywords: ["中断", "轮询", "interrupt", "exti", "什么时候用中断", "中断和轮询", "轮询和中断"],
      answer: [
        "轮询由 CPU 主动反复检查状态，结构直观但可能浪费时间；中断在事件发生时打断当前流程，响应更及时，但增加并发和优先级复杂度。",
        "低频、非关键事件可以轮询；需要及时响应且事件稀疏时适合中断。中断服务函数应短小：清标志、保存必要数据、通知主循环或任务。"
      ],
      links: [
        ["EXTI 外部中断", "courses/exti/"],
        ["ST RM0008 外设参考手册", "https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "NVIC 中断优先级",
      keywords: ["nvic", "中断优先级", "抢占优先级", "响应优先级", "优先级分组"],
      answer: [
        "Cortex-M 的中断优先级数值越小，优先级通常越高。抢占优先级决定能否打断另一个中断，子优先级用于同时挂起时的先后顺序。",
        "优先级位数因芯片而异。使用 RTOS 时还必须遵守内核对可调用系统 API 的中断优先级限制，不能只凭数值直觉配置。"
      ],
      links: [
        ["EXTI 外部中断", "courses/exti/"],
        ["ST PM0056 Cortex-M3 手册", "https://www.st.com/resource/en/programming_manual/cd00228163-stm32f10xxx20xxx21xxxl1xxxx-cortexm3-programming-manual-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "串口乱码",
      keywords: ["乱码", "串口乱码", "uart乱码", "波特率", "baud", "字符不对"],
      answer: [
        "先确认两端的波特率、数据位、停止位和校验位完全一致，最常见组合是 115200、8 数据位、无校验、1 停止位。",
        "如果配置一致仍乱码，检查系统时钟和 UART 时钟源是否正确、晶振参数是否与板卡一致，并测量实际波特率。还要确认终端使用 UTF-8，以及发送缓冲区长度没有写错。"
      ],
      links: [
        ["UART 串口通信", "courses/uart/"],
        ["ST RM0008 外设参考手册", "https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "printf 重定向到串口",
      keywords: ["printf", "重定向", "串口打印", "日志", "retarget"],
      answer: [
        "printf 最终需要把字符交给 UART 发送函数。不同编译器可能要求实现 _write、fputc 或底层输出接口。",
        "调试阶段可以阻塞发送；实时系统中应避免在中断里大量 printf，可改用环形缓冲区、DMA 或分级日志。还要检查是否启用了浮点格式化，否则 %f 可能无效。"
      ],
      links: [["UART 串口通信", "courses/uart/"]]
    },
    {
      title: "UART、I2C 与 SPI",
      keywords: ["uart和i2c", "uart和spi", "i2c和spi", "通信接口", "uart", "i2c", "spi", "串口和i2c", "串口和spi"],
      answer: [
        "UART 通常是点对点异步通信，只需 TX/RX；I2C 使用两根线并通过地址连接多个设备；SPI 使用时钟和独立片选，速度通常更高但占用更多引脚。",
        "选型时看距离、速度、设备数量、布线和软件复杂度。板内传感器常用 I2C/SPI，调试日志和模块通信常用 UART。"
      ],
      links: [["UART 串口通信", "courses/uart/"]]
    },
    {
      title: "定时器与 PWM",
      keywords: ["定时器", "timer", "tim", "pwm", "占空比", "频率", "呼吸灯"],
      answer: [
        "定时器计数频率通常由定时器时钟除以预分频器得到，更新频率再由自动重装值决定。PWM 的频率由计数周期决定，占空比由比较值决定。",
        "注意 APB 分频不为 1 时，部分 STM32 系列的定时器时钟会倍频。计算后应使用示波器或逻辑分析仪验证实际频率。"
      ],
      links: [
        ["TIM 与 PWM", "courses/tim-pwm/"],
        ["ST AN4776 定时器应用笔记", "https://www.st.com/resource/en/application_note/an4776-generalpurpose-timer-cookbook-for-stm32-microcontrollers-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "ADC 读数不稳定",
      keywords: ["adc", "adc不稳定", "adc跳动", "模拟采样", "采样值", "采样噪声", "电压不准", "读数不稳定"],
      answer: [
        "先用 GND、参考电压或电位器建立可控输入，并用万用表直接测量 ADC 引脚。输入浮空、信号源阻抗过高、采样时间过短和参考电压波动都会让结果不稳定。",
        "确认引脚处于模拟模式、通道正确、ADC 已按系列要求校准。可以统计一组样本的平均值、最小值和最大值，但平均只能减少随机噪声，不能修复参考电压或分压比例错误。"
      ],
      links: [
        ["ADC 与 DMA 采样", "courses/adc-dma/"],
        ["ST AN2834 ADC 精度应用笔记", "https://www.st.com/resource/en/application_note/an2834-how-to-optimize-the-adc-accuracy-in-the-stm32-mcus-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "ADC 与 DMA 连续采样",
      keywords: ["adc dma", "adc+dma", "连续采样", "循环采样", "dma只采一次", "半传输", "双缓冲"],
      answer: [
        "ADC + DMA 适合把连续转换结果自动写入内存。配置时检查外设到内存方向、数据宽度、内存递增、循环模式和传输长度单位。",
        "DMA 写入时 CPU 不应同时修改同一缓冲区。连续流可用半传输/全传输回调或双缓冲明确所有权；带数据 Cache 的系列还必须处理 Cache 一致性。"
      ],
      links: [
        ["ADC 与 DMA 采样", "courses/adc-dma/"],
        ["ST AN2548 DMA 应用笔记", "https://www.st.com/resource/en/application_note/an2548-using-the-stm32f0f1f3cxgxlx-series-dma-controller-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "I2C 设备无应答",
      keywords: ["i2c", "i²c", "i2c无应答", "i2c不应答", "设备无应答", "设备不应答", "不应答", "nack", "no ack", "设备找不到", "地址错误", "总线卡死"],
      answer: [
        "地址后立即 NACK 时，按顺序检查供电与共地、SDA/SCL 是否接反、上拉电阻、7 位地址表示和地址选择脚。特别注意不要把已经左移的 8 位地址再次左移。",
        "若 SDA 一直为低，设备或主机可能在上次事务中途复位。为每次访问设置超时，记录 HAL 错误码，并依据器件要求执行重新初始化或总线恢复。"
      ],
      links: [
        ["I²C 传感器通信", "courses/i2c/"],
        ["ST RM0008 外设参考手册", "https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf"],
        ["ST ES096 F103x8/xB 勘误", "https://www.st.com/resource/en/errata_sheet/es096-stm32f101x8b-stm32f102x8b-and-stm32f103x8b-mediumdensity-device-limitations-stmicroelectronics.pdf"]
      ]
    },
    {
      title: "SPI 读取 0x00 或 0xFF",
      keywords: ["spi", "0xff", "0x00", "spi没数据", "spi读不到", "cpol", "cpha", "片选", "miso"],
      answer: [
        "持续读到 0xFF 常见于 MISO 未被驱动、片选无效、器件未供电或线路开路；持续 0x00 也可能是接线、模式或器件状态问题。先观察 CS、SCK、MOSI、MISO 四条波形。",
        "核对 CPOL/CPHA、位序、最高时钟、命令格式和 dummy byte。片选必须覆盖器件手册要求的完整事务，错误路径也要释放片选。"
      ],
      links: [
        ["SPI 与外部器件", "courses/spi/"],
        ["ST RM0008 外设参考手册", "https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf"],
        ["ST DS5319 F103x8/xB 数据手册", "https://www.st.com/resource/en/datasheet/stm32f103c8.pdf"]
      ]
    },
    {
      title: "阻塞延时与非阻塞设计",
      keywords: ["delay", "延时", "阻塞", "非阻塞", "hal_delay", "卡住"],
      answer: [
        "阻塞延时会让 CPU 在等待期间无法处理其他工作，适合极简单的演示，不适合多个任务并行的项目。",
        "非阻塞设计通常记录起始时间，并在主循环中比较当前节拍；更复杂的逻辑用状态机、定时器回调或 RTOS 延时。"
      ],
      links: [["TIM 与 PWM", "courses/tim-pwm/"]]
    },
    {
      title: "DMA 的作用",
      keywords: ["dma", "直接存储器访问", "搬运数据", "cpu占用"],
      answer: [
        "DMA 可以在外设与内存之间搬运数据，减少 CPU 逐字节处理的负担。常见用途包括 UART 连续接收、ADC 采样和 SPI 屏幕刷新。",
        "DMA 并不等于完全不用软件：仍要配置方向、长度、地址递增、数据宽度和完成/半完成中断，并处理缓存一致性与缓冲区生命周期。"
      ],
      links: [
        ["ADC 与 DMA 采样", "courses/adc-dma/"],
        ["进阶学习路线", "tracks/advanced/"]
      ]
    },
    {
      title: "HAL、LL 与寄存器开发",
      keywords: ["hal", "ll", "寄存器", "库函数", "标准库", "哪个好"],
      answer: [
        "HAL 可读性和跨系列迁移性较好，适合快速构建；LL 更接近硬件且开销较小；寄存器开发控制最直接，但维护成本最高。",
        "学习时可以用 HAL 完成项目，同时对照参考手册理解关键寄存器。性能敏感处再局部使用 LL 或寄存器，不必把三种方式对立起来。"
      ],
      links: [["进阶学习路线", "tracks/advanced/"]]
    },
    {
      title: "volatile 关键字",
      keywords: ["volatile", "易变变量", "优化", "寄存器变量", "中断变量"],
      answer: [
        "volatile 告诉编译器每次都从实际存储位置读取或写入，常用于硬件寄存器、被中断修改的标志，以及可能被并发环境改变的对象。",
        "volatile 不保证操作原子性，也不是线程同步工具。多任务共享数据仍可能需要临界区、原子操作、互斥量或消息队列。"
      ],
      links: [["专家学习路线", "tracks/expert/"]]
    },
    {
      title: "C 语言指针",
      keywords: ["指针", "pointer", "地址", "取地址", "解引用", "野指针", "空指针"],
      answer: [
        "指针是保存内存地址的变量。& 取得对象地址，* 在声明中表示指针类型，在表达式中表示访问该地址指向的对象。",
        "嵌入式开发中，数组、缓冲区、外设寄存器和回调函数都离不开指针。务必初始化指针，检查长度和生命周期，避免越界、空指针与悬空指针。"
      ],
      links: [["串口命令行项目", "projects/uart-console/"]]
    },
    {
      title: "栈、堆与静态内存",
      keywords: ["栈", "堆", "stack", "heap", "malloc", "内存分配", "局部变量", "全局变量"],
      answer: [
        "栈通常保存局部变量、返回地址和调用现场，速度快但容量有限；堆用于动态分配，灵活但可能碎片化；静态/全局对象在整个程序生命周期内存在。",
        "资源受限的 MCU 常优先静态分配。避免在小栈中放大型数组，也不要在实时路径频繁 malloc/free。可通过链接映射文件和栈水位检查评估内存。"
      ],
      links: [["专家学习路线", "tracks/expert/"]]
    },
    {
      title: "二进制、十六进制与位运算",
      keywords: ["二进制", "十六进制", "hex", "bit", "位运算", "按位与", "按位或", "移位", "掩码"],
      answer: [
        "十六进制每一位对应 4 个二进制位，因此非常适合阅读寄存器。常见操作包括：用 | 设置位，用 & 配合掩码读取位，用 &~ 清除位，用 ^ 翻转位。",
        "移位前确认数据类型宽度和符号性，例如使用 1U << n，避免有符号移位和超出位宽带来的未定义行为。"
      ],
      links: [["GPIO 输入输出", "courses/gpio/"]]
    },
    {
      title: "HardFault 排查",
      keywords: ["hardfault", "hard fault", "硬错误", "跑飞", "死机", "异常复位"],
      answer: [
        "HardFault 常见原因包括非法地址访问、空指针、栈溢出、未对齐访问、执行损坏的函数指针以及其他 Fault 未启用时的升级。",
        "先保留现场，不要立即复位；读取 CFSR、HFSR、BFAR、MMFAR，并查看异常栈中的 PC/LR。结合 map 文件定位出错指令，再检查调用栈、数组边界和中断优先级。"
      ],
      links: [["专家学习路线", "tracks/expert/"]]
    },
    {
      title: "看门狗",
      keywords: ["看门狗", "watchdog", "iwdg", "wwdg", "喂狗", "自动复位"],
      answer: [
        "看门狗用于在软件失控时复位系统。IWDG 通常由独立低速时钟驱动，可靠性高；WWDG 还要求在规定时间窗口内刷新。",
        "不要在任意位置无条件喂狗。更可靠的设计是让监控任务确认关键任务都在正常运行后统一刷新，并在复位后记录复位原因。"
      ],
      links: [["高级学习路线", "tracks/expert/"]]
    },
    {
      title: "RTOS 是否必要",
      keywords: ["rtos", "freertos", "操作系统", "任务", "线程", "要不要用rtos"],
      answer: [
        "功能简单、时序清晰的项目可以使用主循环加中断和状态机。任务增多、存在阻塞通信或需要明确优先级时，RTOS 能改善结构，但也带来栈、同步和调度问题。",
        "在使用 RTOS 前应先掌握中断、定时器、状态机和基本并发概念。任务之间优先使用队列、通知和事件组传递信息，谨慎共享全局变量。"
      ],
      links: [["进阶学习路线", "tracks/advanced/"]]
    },
    {
      title: "时钟树与系统频率",
      keywords: ["时钟树", "系统时钟", "hse", "hsi", "pll", "apb", "ahb", "频率不对"],
      answer: [
        "STM32 时钟通常从 HSI/HSE 进入 PLL，再分配到 AHB、APB 和各外设。任何一级分频配置错误都可能影响串口波特率、定时器和系统节拍。",
        "先核对板卡晶振频率，再查看 CubeMX 时钟树和 SystemCoreClock。不要只相信界面显示，关键时序应通过 MCO、串口或示波器验证。"
      ],
      links: [["第一个工程", "getting-started/first-project/"]]
    },
    {
      title: "低功耗基础",
      keywords: ["低功耗", "sleep", "stop", "standby", "唤醒", "耗电"],
      answer: [
        "低功耗优化应先测量再修改。区分运行、Sleep、Stop 和 Standby，逐步关闭不用的外设时钟、GPIO 漏电路径和调试接口。",
        "进入低功耗前确认唤醒源、时钟恢复和外设状态；退出后重新配置可能失效的时钟与外设。开发板上的稳压器和指示灯也可能主导总功耗。"
      ],
      links: [["专家学习路线", "tracks/expert/"]]
    },
    {
      title: "Bootloader 与固件升级",
      keywords: ["bootloader", "固件升级", "iap", "ota", "启动加载", "分区"],
      answer: [
        "Bootloader 负责验证并跳转到应用程序，也可通过 UART、USB、CAN 或网络更新固件。核心问题包括 Flash 分区、向量表重定位、升级中断电恢复和镜像完整性。",
        "面向产品时还应验证签名、防回滚并保存升级状态。不要只校验 CRC 就把它当作安全机制。"
      ],
      links: [["大师学习路线", "tracks/master/"]]
    },
    {
      title: "调试问题的方法",
      keywords: ["怎么调试", "排查问题", "debug", "断点", "程序不运行", "问题定位"],
      answer: [
        "先把问题缩小：确认供电和连接，再确认代码是否进入 main、卡在哪一步、外设寄存器是否符合预期。每次只改变一个变量。",
        "优先使用断点、观察窗口、寄存器视图、串口日志和逻辑分析仪收集证据。记录芯片型号、工具版本、最小复现步骤和预期/实际结果，比反复重生成工程更有效。"
      ],
      links: [["第一个工程与调试", "getting-started/first-project/"]]
    },
    {
      title: "资料应该看哪一份",
      keywords: ["数据手册", "参考手册", "datasheet", "reference manual", "用户手册", "勘误", "文档"],
      answer: [
        "板卡 User Manual 用来查板上连接；Data Sheet 查电气限制、封装和复用；Reference Manual 查外设行为；Programming Manual 查 Cortex-M 内核；Errata 查已知硬件问题。",
        "回答具体问题时记录文档编号、版本、章节和芯片完整型号。不同 STM32 系列的寄存器和限制不能直接照搬。"
      ],
      links: [
        ["F103C8T6 官方资料索引", "resources/f103-official-docs/"],
        ["ST STM32F103 官方文档页", "https://www.st.com/en/microcontrollers-microprocessors/stm32f103/documentation.html"]
      ]
    }
  ]
};

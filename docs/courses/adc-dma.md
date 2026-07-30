---
title: 07 · ADC 与 DMA 采样
---

# 07 · ADC 与 DMA 采样

<div class="lesson-progress" data-lesson-id="adc-dma-001" data-lesson-title="ADC 与 DMA 采样"></div>

## 学习目标

完成本课后，你应当能够：

- 解释参考电压、分辨率、采样时间与数字结果之间的关系；
- 使用 DMA 把一组 ADC 结果持续写入内存；
- 用平均值和最小/最大值判断噪声水平；
- 区分信号源、模拟前端、ADC 配置和缓冲区使用错误。

## 从电压到数字量

理想情况下，`N` 位 ADC 的输出范围是 `0` 到 `2^N - 1`。若参考电压为 `Vref`，可用下面的近似关系换算：

```text
voltage ≈ raw × Vref / (2^N - 1)
```

这个公式只是起点。真实结果还会受参考电压误差、输入阻抗、采样时间、噪声、芯片校准和布局影响。不要默认 `Vref` 永远等于 3.300 V，重要测量应实际验证。

## 建立可控输入

第一次实验不要直接连接复杂传感器。可以使用：

1. GND，结果应接近零；
2. 3.3 V，结果应接近满量程；
3. 电位器中点，结果应随旋钮平滑变化。

!!! warning "不要超过允许输入范围"
    ADC 引脚允许的电压、是否容忍 5 V、参考电压范围和最大采样速率因型号而异。连接前必须查目标芯片 Data Sheet。

## CubeMX 配置

1. 把目标引脚配置为 ADC 通道和模拟模式；
2. 先使用单通道、软件触发；
3. 为 ADC 增加 DMA，方向为外设到内存；
4. 数据宽度与 ADC 结果一致，内存地址递增；
5. 连续实验可使用循环模式；
6. 选择较长采样时间作为稳定起点。

## 启动 DMA 采样

```c
#define ADC_SAMPLE_COUNT 64U

static uint16_t adc_samples[ADC_SAMPLE_COUNT];

void app_adc_start(void)
{
    if (HAL_ADC_Start_DMA(
            &hadc1,
            (uint32_t *)adc_samples,
            ADC_SAMPLE_COUNT) != HAL_OK) {
        Error_Handler();
    }
}
```

`hadc1`、通道和 DMA 实例来自你的 `.ioc` 配置。部分系列还需要在启动前执行 ADC 校准，请核对对应 HAL 驱动和参考手册。

## 计算可观察结果

```c
typedef struct {
    uint16_t minimum;
    uint16_t maximum;
    uint32_t average;
} adc_stats_t;

static adc_stats_t adc_calculate(
    const uint16_t *samples,
    size_t count)
{
    adc_stats_t result = { .minimum = UINT16_MAX };
    uint32_t sum = 0U;

    for (size_t i = 0; i < count; ++i) {
        uint16_t value = samples[i];
        if (value < result.minimum) result.minimum = value;
        if (value > result.maximum) result.maximum = value;
        sum += value;
    }

    result.average = count ? sum / count : 0U;
    return result;
}
```

通过 UART 周期打印平均值、最小值和最大值。若最大值与最小值差距很大，应先检查输入是否浮空、采样时间是否过短以及模拟地是否稳定。

## 缓冲区所有权

DMA 写入缓冲区时，CPU 也可能同时读取。简单实验可以在转换完成回调中设置标志，让主循环随后处理；连续高速采样应使用半传输/全传输回调或双缓冲，明确哪一半正在写、哪一半可以读。

!!! note "高性能系列的 Cache"
    带数据 Cache 的系列还要处理 DMA 与 Cache 一致性。本课不提供通用地址或 Cache 操作，因为它们依赖具体内核、存储区和芯片系列。

## 验收方法

- 接地时平均值接近零，且波动可解释；
- 接固定电压时连续 30 秒没有缓冲区越界或停止；
- 转动电位器时数值变化方向正确；
- 能解释采样时间变长后结果为什么可能更稳定；
- 故意配置错误通道后，能通过引脚和寄存器检查定位。

## 常见问题

??? question "读数一直为 0 或满量程"
    检查实际引脚、通道编号、模拟模式、供电和信号地。用万用表直接测量 ADC 引脚电压，不要只看传感器输出说明。

??? question "DMA 只更新一次"
    检查 DMA 是否为循环模式、ADC 是否持续触发，以及错误回调中是否已经停止。确认传输长度单位与缓冲区元素类型一致。

??? question "平均值稳定但换算电压不准"
    核对真实参考电压、ADC 分辨率、校准状态和分压电阻误差。平均只能减少随机噪声，不能修复系统误差。

## 练习

- 对比 8、32、128 个样本平均后的波动；
- 使用定时器触发 ADC，测量实际采样周期；
- 在不阻塞主循环的情况下，每秒输出一次统计结果。

## 官方资料与核对路径

| 文档 | 建议核对内容 |
|---|---|
| [RM0008 · STM32F1 Reference Manual](https://www.st.com/resource/en/reference_manual/cd00171190-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf) | `Analog-to-digital converter`、校准、采样时间；`DMA controller`、通道映射 |
| [DS5319 · STM32F103x8/xB Data Sheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf) | ADC 输入范围、采样参数、VDDA/VSSA 和引脚定义 |
| [AN2834 · ADC accuracy](https://www.st.com/resource/en/application_note/an2834-how-to-optimize-the-adc-accuracy-in-the-stm32-mcus-stmicroelectronics.pdf) | 参考电压、输入阻抗、布局、校准和噪声来源 |
| [AN2548 · DMA controller](https://www.st.com/resource/en/application_note/an2548-using-the-stm32f0f1f3cxgxlx-series-dma-controller-stmicroelectronics.pdf) | 数据宽度、地址递增、仲裁和缓冲区设计 |

发生“配置正确但行为异常”时，再查 [ES096](https://www.st.com/resource/en/errata_sheet/es096-stm32f101x8b-stm32f102x8b-and-stm32f103x8b-mediumdensity-device-limitations-stmicroelectronics.pdf)。

## 下一步

[通过 I²C 读取一个数字传感器 →](i2c.md)

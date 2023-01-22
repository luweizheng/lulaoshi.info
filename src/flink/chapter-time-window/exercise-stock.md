---
title: 练习：股票价格
order: 6
head:
  - - meta
    - name: keywords
      content: Flink, DataStream, 股票, 数据流
description: "本节将继续使用Flink的DataStream API来处理股票数据流，这里增加了时间和窗口相关的概念。"
category: [Flink]
article: false
---

::: tip

本教程已出版为《Flink原理与实践》，感兴趣的读者请在各大电商平台购买！

京东下单👉 <a href="https://item.jd.com/13154364.html"> <Badge text="京东" color="#428bca" /></a> 配套源码👉 <a href="https://github.com/luweizheng/flink-tutorials"> <Badge text="GitHub源码" color="grey" /> </a>

:::

经过本章的学习，读者应该可以对时间处理有了比较全面的了解，本节继续以股票价格这个场景来实践时间处理相关内容。

## 实验目的

针对具体的业务场景，学习如何设置窗口，如何在窗口上进行计算。

## 实验内容

股票交易场景，我们经常见到名为“K线”的概念。K线形如蜡烛，它反应了价格的走势，在一个K线内同时记录了开盘价（Open）、最高价（High）、最低价（Low）、收盘价（Close）。这里我们以5分钟为一个周期，计算该周期内的K线数据，即5分钟内的开盘价、最高价、最低价和收盘价（OHLC）。

关于价格，常见的是计算一个时间段内的平均值，考虑到交易量的权重，另外一个经常使用的一个计算价格的方式为交易量加权平均值（Volume Weighted Average Price，VWAP）。它的公式为：
$$
VWAP = \frac{\sum price \times volume}{\sum volume}
$$

## 实验要求

使用你认为合适的算子和函数，完成下面两个程序，使用`print`将结果打印输出。你可以根据需要自定义中间数据结构。

* 程序1：以5分钟为一个时间单位，计算其OHLC各值。

* 程序2：以5分钟为一个时间单位，计算VWAP。

## 实验报告

将思路和程序整理后撰写为实验报告。
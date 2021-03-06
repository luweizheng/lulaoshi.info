---
title: 习题 电商平台用户行为分析
keywords: Flink, DataStream, State, 状态, Keyed State, Checkpoint
description: "本节将练习使用Keyed State完成对电商平台用户的行为分析，并设置Checkpoint。"

chapter-name: 状态、检查点和保存点
chapter-url: /flink/chapter-state-checkpoint/index.html
---

经过本章的学习，相信读者朋友已经了解状态的基本原理，包括如何使用Keyed State或Operator State进行有状态的计算。本节将继续以电商用户行为分析为场景，对状态相关知识进行实践。

## 实验目的

学习使用Keyed State，设置Checkpoint。

## 实验内容

在[状态](./state.html)章节的Keyed State部分，我们介绍了电商用户行为场景，并举了一些例子，本次练习仍然基于这个场景。我们知道，一天之内，一个用户第一次产生行为到真正购买，这之间有一个时间差，这个时间是一个非常重要的指标，有助于商家提升产品质量和营销水平。这里我们使用Keyed State来实现一个程序，主要用来计算这个时间差。

## 实验要求

读者可以根据本书样例程序中提供的数据集和Source作为输入，编程完成下面的要求。

* 要求1：

使用Keyed State，计算每个用户当天第一次产生行为到第一次产生购买行为之间的时间差。在实现时需要注意，这里只考虑第一次产生购买行为，而不是多次产生购买行为中的最后一次。使用`print`将结果打印出来。

* 要求2：

开启Checkpoint，选择一种State Backend，将状态定期保存到存储的某个位置。

## 实验报告

将思路和程序整理后撰写为实验报告。
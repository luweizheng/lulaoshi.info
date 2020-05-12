---
title: 关于本章 
keywords: Flink, DataStream, 状态, State, Checkpoint, Savepoint
sidebar: sidebar_flink

chapter-name: 状态、检查点和保存点
chapter-url: /flink/chapter-state-checkpoint/index.html
---

经过前两章的学习，我们已经能够使用Flink的DataStream API处理常见的数据流，完成窗口上的业务需求。前两章中的部分案例也曾提到状态，本章将重点围绕状态和检查点两个概念来介绍如何在Flink上进行有状态的计算。通过本章的学习，读者可以了解下面这些知识：

* [Flink中几种常用的状态以及具体使用方法](./state.html)
* [Checkpoint机制的原理和配置方法](./checkpoint.html)
* [Savepoint机制与Checkpoint机制的区别以及读写Savepoint的方法](./savepoint.html)

最后的习题中，我们以电商用户行为数据流为例，对其进行有状态的计算。读者阅读完本章之后，能够掌握Flink的状态和检查点等相关知识。
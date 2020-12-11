---
title: 关于本章 
keywords: Flink, DataStream, 状态, State, Checkpoint, Savepoint

chapter-name: 状态、检查点和保存点
chapter-url: /flink/chapter-state-checkpoint/index.html
---

经过前两章的学习，我们已经能够使用Flink的DataStream API处理常见的数据流，完成窗口上的业务需求。前两章中的部分案例也曾提到状态，本章将重点围绕状态和检查点两个概念来介绍如何在Flink上进行有状态的计算。通过本章的学习，读者可以了解下面这些知识：

* Flink中几种常用的状态以及具体使用方法，包括[Keyed State](./state.html#keyed-state的使用方法)和[Operator State](./state.html#operator-list-state的使用方法)
* [Checkpoint机制的原理](./checkpoint.html#flink分布式快照流程)、[状态后端](./checkpoint.html#flink分布式快照流程)和[配置方法](./checkpoint.html#checkpoint相关配置)
* [Savepoint机制与Checkpoint机制的区别](./savepoint.html#savepoint与checkpoint的区别)以及[读写Savepoint的方法](./savepoint.html#读写savepoint中的数据)

最后的习题中，我们以电商用户行为数据流为例，对其进行有状态的计算。读者阅读完本章之后，能够掌握Flink的状态和检查点等相关知识。
---
title: Milvus：向量数据库
order: 3
head:
  - - meta
    - name: keywords
      content: 向量数据库, Milvus
description: ""
category: [数据库, AI]
article: false
---

本文主要解读 Milvus 团队发表在 VLDB 2022的[论文](https://www.vldb.org/pvldb/vol15/p3548-yan.pdf)。

## 向量数据库与传统数据库的区别

* 不需要支持复杂的 Transaction。向量数据库不需要像传统数据库一样切分字段，设计不同的表；深度学习把数据都编码成了向量。所以，表的多行（multi-row）和多表（multi-table）Transaction 不需要了；行级别的ACID就够了。
* 一致性（Consistency）是可调的。传统数据库支持强一致性的，但是向量数据库的一致性需要可调节。
* 硬件利用。向量数据库与深度学习高度耦合，深度学习依赖 GPU/DSA/FPGA、大内存，向量数据库的应用场景又多，有的场景需要很强的 GPU 算力，有的可能不需要。硬件资源如果管理不好就造成浪费。
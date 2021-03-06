---
title: 关于本章 
keywords: GPU, CPU, Python, Numba

chapter-name: 使用Python Numba进行CUDA编程
chapter-url: /gpu/python-cuda/index.html
---

考虑到C/C++程序开发难度较高，需要了解语法、编译和执行等一系列指示，而Python上手简单，我们主要基于Python的Numba来学习GPU编程。

本章前半部分是CUDA入门，包括：

* [Python Numba简介](./numba.html)

* [CUDA中Grid、Block、Thread层次结构](./cuda-intro.html)

理解了这些知识，我们应该对CUDA并行编程有一个初步的认识。

后面几篇文章主要介绍一些进阶技巧，优化一些CUDA程序时有可能会用到：

* [网格跨步](./stride.html)

* [多流](./streams.html)

* [Shared Memory](./shared-memory.html)
---
title: 关于本章 
keywords: 
    - 线性模型
    - 机器学习入门
    - 线性回归
---

这部分偏向于机器学习的入门资料，主要是基于线性模型。

我们从[线性回归](./linear-regression.md)开始，了解一些机器学习的入门概念和知识，然后介绍两种线性回归的[求解方法](./minimise-loss-function.md)：正规方程法和梯度下降法。接着，我们从[最大似然估计](./maximum-likelihood-estimation.md)的概率角度来重新理解线性回归。

一个机器学习模型过于逼近训练数据，但在新数据上预测效果不好，容易产生过拟合问题；反之则产生欠拟合问题。对于过拟合的问题，线性模型可以使用[正则化](./regularization.md)的方式来解决。线性回归经过L2正则化就是岭回归，经过L1正则化就是Lasso回归。

线性模型再套上一个Sigmoid函数，就是[Logistic Regression](./logistic-regression.md)。Logistic Regression是应用最为广泛的机器学习模型之一，曾广泛应用在互联网点击预估领域。
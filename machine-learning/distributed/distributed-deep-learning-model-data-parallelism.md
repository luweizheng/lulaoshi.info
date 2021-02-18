---
title: 分布式深度学习简介：数据并行和模型并行
keywords: 神经网络, 分布式机器学习, 深度神经网络, 深度学习, 数据并行, 模型并行
description: "分布式深度学习常常采用两种方式，数据并行和模型并行。"

chapter-name: 分布式深度学习
chapter-url: /machine-learning/distributed/index.html
---

{% katexmm %}

## 前言

现在深度学习模型的参数量已经变得越来越多了，数据集的大小也随之疯狂地增长。在更大的数据集上训练一个复杂的深度学习模型，单节点上的机器学习耗时过长，我们不得不使用多节点并行计算，即分布式机器学习。这里谈到的并行，通常包括以下几种，或者它们各自的混合：

1. 数据并行 (Data Parallel)
2. 模型并行 (Model Parallel)
3. 数据模型并行（Data-Model Parallel）

## 数据并行

在现代深度学习中，数据集越来越大，以至于我们很难将所有数据集都加载到内存中，我们通常使用随机梯度下降法，对数据集的每个批次(batch)进行损失函数的求导，获得各个参数的梯度。如果我们的数据集有25600个样本数据，每次我们只从中取出256个样本数据去计算梯度，此时，batch_size为256，但是要把整个数据集都迭代一遍需要100次。如果我们尝试一次性去计算所有样本数据的梯度，我们的GPU显存可能无法容纳那么大的数据。比如，ImageNet等图形图像数据集大约有100+GB的数据，一个SOTA（state of the art）模型本身也有GB级的参数，单张GPU卡大约有10至40GB显存，如果只在单张GPU卡上进行计算，我们可以适当调整batch_size，以满足GPU卡显存的限制。但是仅凭单张GPU卡进行计算，数据集迭代一遍需要更多次循环，时间更长。

![数据并行](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-12-17-054300.jpg){: .align-center}
*数据并行*

为了加快模型的训练，我们可以使用分布式计算的思路，把这个大批次分割为很多小批次，使用多个节点进行计算，在每个节点上计算一个小批次，对若干个节点的梯度进行汇总后再加权平均，最终求和就得到了最终的大批次的梯度结果。

$$
\begin{aligned}
\frac{\partial L}{\partial w} 
&= \frac{\partial \Big[ \frac{1}{n} \sum_{i=1}^{n} f(x^{(i)}, y^{(i)}) \Big] }{\partial w} \\
&= \frac{1}{n} \sum_{i=1}^{n}  \frac{\partial f(x^{(i)}, y^{(i)}) }{\partial w} \\
&= \frac{m_1}{n} \frac{\partial \Big[ \frac{1}{m_1} \sum_{i=1}^{m_1} f(x^{(i)}, y^{(i)}) \Big] }{\partial w} + \cdots + \frac{m_k}{n}  \frac{\partial \Big[ \frac{1}{m_k} \sum_{i=m_{k-1} + 1}^{m_{k-1} + m_k} f(x^{(i)}, y^{(i)}) \Big] }{\partial w} \\
&= \frac{m_1}{n} \frac{\partial l_1}{\partial w} + \frac{m_2}{n} \frac{\partial l_2}{\partial w} + \cdots + \frac{m_k}{n} \frac{\partial l_k}{\partial w}
\end{aligned}
$$

在上面这个公式中：$w$ 是模型的参数；$\frac{\partial L}{\partial w}$ 是采用`batch_size = n`计算得到的真实梯度。这个公式想要证明的是，我们可以在不同的节点上分别对`n`的一部分进行梯度的计算，将各个GPU的梯度进行汇总后的加权平均值。公式中最后一行中，在第k个节点有$m_k$个数据，$\dfrac{\partial l_k}{\partial w}$ 是该节点上计算得到梯度。$m_1+m_2+\cdots+m_k = n$，n个样本数据被分拆到了多个节点上。

其中，$x^{(i)}$和$y^{(i)}$是样本数据$i$的特征和标签；对于样本数据$i$,$f(x^{(i)}, y^{(i)})$是前向传播的损失函数。

如果我们对每个节点上的数据量平分，我们有：

$$
\begin{aligned}
\frac{\partial L}{\partial w} 
&= \frac{1}{k} \big[ \frac{\partial l_1}{\partial w} + \frac{\partial l_2}{\partial w} + \cdots + \frac{\partial l_k}{\partial w} \big]
\end{aligned}
$$

对于每个节点来说，我们使用相同的模型参数进行前向传播，我们把整个大批次数据分割成很多个小批次数据，发送到不同的节点上，每个节点都正常地计算其梯度，计算完后返回其梯度计算结果到主节点。这一步通常是异步的，因为每个节点的速度可能都稍有差别。一旦我们得到了所有的梯度，我们计算这些梯度的平均加权，并且使用这个平均加权的梯度去更新整个模型的参数。接着，我们就继续下一轮迭代。

## 模型并行

模型并行乍一听挺唬人的，但是其实和令人生畏的数学没太大关系。模型并行更多的是一种对计算机资源的分配问题。有时候我们的模型可能太大了，大到不能把整个模型加载到一个节点的内存（或者GPU显存）中，因为其中有着太多的层，太多的参数。因此，我们可以考虑把整个模型按层分解成若干份，把连续的几层加载到一个节点。系统中不同的节点计算着整个模型的不同的层。

![模型并行](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-12-17-054241.jpg){: .align-center}
*模型并行*

假如我们有10个GPU节点，我们想要训练一个ResNet-50网络（模型共有50层）。我们可以将前5层分配给GPU#1， 第二个5层分给GPU#2，如此类推，最后的5层分配给了GPU#10。实际训练过程中，在每次迭代中，前向传播首先在GPU#1进行，接下来是GPU#2，#3等等。这个过程是串行的，后面的节点必须等待前面的节点运算完之后才能接着运算，但是，反过来说，后面节点在进行运算的时候，并不妨碍前面的节点进行下一个批次的运算，这就组成了一个流水线（pipeline）。当涉及到反向传播时，我们首先计算GPU#10的梯度，更新网络参数。然后我们继续计算前一节点GPU#9的梯度，并更新网络参数，以此类推。每个节点就像是一个工厂流水线上的一小部分，所有节点组成了一个流水线。

## 一些思考

模型并行的名字其实有点误导性，因为模型并行有时候并不是一个非常好的可并行计算的例子。一个更为精确的名字应该类似于“模型串行化”，因为它使用了一种串行化的方法而不是一种并行的方法。然而，在一些模型场景中，神经网络中的一些层的确可以做到并行化，比如siamese network，其不同的分支是可以看成完全的并行的。在这种场景中，模型并行可以表现得和真正的并行计算一样。

![模型并行和数据并行](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-12-07-080830.png){: .align-center}
*模型并行和数据并行*

简而言之，模型并行如上图左侧所示，整个神经网络的不同层分布在不同的节点上；数据并行如上图右侧所示，每个节点包含了整个神经网络，每个节点使用一小部分数据来更新参数。模型并行和数据并行也不是完全互斥的，模型并行和数据并行可以组合在一起，比如下图所示，每个节点有多张GPU卡，可以将神经网络不同层分配到不同GPU上，多个节点分别处理数据的一个子集。

![数据模型并行](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-12-07-080837.png){: .align-center}
*数据模型并行*

{% endkatexmm %}

**参考资料**

1. [https://leimao.github.io/blog/Data-Parallelism-vs-Model-Paralelism/](https://leimao.github.io/blog/Data-Parallelism-vs-Model-Paralelism/)
2. [https://xiandong79.github.io/Intro-Distributed-Deep-Learning](https://xiandong79.github.io/Intro-Distributed-Deep-Learning)
3. [【深度学习】— 分布式训练常用技术简介](https://zhuanlan.zhihu.com/p/276122469)
---
title:  "什么是词向量？如何得到词向量？Embedding 快速解读"
date:   2022-02-22 18:27:00 +0800
description: "Embedding 本质是一个查询矩阵，或者说是一个 dict 数据结构。以词向量为例， Embedding dict 的 Key 是词在词表中的索引位置（Index），Embedding dict 的 Value 是这个词的 `dim` 维的向量。"
category: [自然语言处理]
tag: [词向量]
permalink: /blog/embedding-explained
---

我第一次接触 Embedding 是在 Word2Vec 时期，那时候还没有 Transformer 和 BERT 。Embedding 给我的印象是，可以将词映射成一个数值向量，而且语义相近的词，在向量空间上具有相似的位置。

有了 Embedding ，就可以对词进行向量空间上的各类操作，比如用 Cosine 距离计算相似度；句子中多个词的 Embedding 相加得到句向量。

<figure>
    <img src="http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2022-02-18-word2vec.jpeg" width="100%"/>
    <figcaption>图1 Word2Vec 时期，Embedding 可以将词映射到向量空间，语义相似的词在向量空间里有相似的位置</figcaption>
</figure>

那 Embedding 到底是什么？Embedding 怎么训练出来的？ 

## 查询矩阵和One-Hot

Embedding 本质是一个查询矩阵，或者说是一个 dict 数据结构。以词向量为例， Embedding dict 的 Key 是词在词表中的索引位置（Index），Embedding dict 的 Value 是这个词的 `dim` 维的向量。假设我们想把“北京欢迎你”编码为向量。词表一共5个词（Token）（每个字作为一个词）：“北”: 0、“京”: 1、“欢”: 2、“迎”: 3、“你”: 4。每个 Token 都有文字表示和在词表中的索引（Index）。

:::note
BERT 等模型的 Token 是单个字，一些其他模型的 Token 是多个字组成的词。
:::

深度学习框架都有一个专门的模块来表示 Embedding，比如 PyTorch 中 `torch.nn.Embedding` 就是一个专门用于做 Embedding 的模块。我们可以用这个方法将 Token 编码为词向量。

```python
>>> import torch

>>> embedding = torch.nn.Embedding(num_embeddings=5, embedding_dim=3)
>>> input = torch.LongTensor([1])
>>> print(embedding(input))
tensor([[ 2.0332, -0.8400,  0.8786]], grad_fn=<EmbeddingBackward>)
```

这里 `Embedding` 的参数中，`num_embeddings` 表示词表大小，即词表一共多少个词， `embedding_dim` 为词向量维度。在当前这个例子中，某个词被映射为3维的向量，经过 Embedding 层之后，输出是 Index 为1的 Token 的3维词向量。

Embedding 里面是什么？是一个权重矩阵：

```python
>>> print(embedding.weight)
Parameter containing:
tensor([[ 1.6697, -0.4804, -0.8150],
        [ 2.0332, -0.8400,  0.8786],   # <-- 刚才获取的 Index = 1 的词向量
        [ 1.5699,  0.0025,  0.4386],
        [-1.1474, -1.3720,  0.9855],
        [ 1.3635, -0.6749, -0.5666]], requires_grad=True)
```

输出是 Embedding 中的权重矩阵，是 `num_embeddings * embedding_dim` 大小的矩阵。

刚才那个例子，查找 Index 为1的词向量 ，恰好是 Embedding 权重矩阵的第2行（从0计数的话则为第1行）。

权重矩阵如何做查询呢？ 答案是 One-Hot 。

先以 One-Hot 编码刚才的词表。

$$
\begin{array}{c|c}
\hline
        \text{北} & [1, 0, 0, 0, 0]\\ 
        \text{京} & [0, 1, 0, 0, 0]\\ 
        \text{欢} & [0, 0, 1, 0, 0]\\ 
        \text{迎} & [0, 0, 0, 1, 0]\\ 
        \text{你} & [0, 0, 0, 0, 1]\\ 
\hline 
\end{array}
$$

为了得到词向量，`torch.nn.Embedding` 中执行了一次全连接计算：

$$
\begin{pmatrix}
        0 & 1 & 0 & 0 & 0 
\end{pmatrix}
\begin{pmatrix}
w_{01} & w_{02} & w_{03}\\ 
w_{11} & w_{12} & w_{13}\\ 
w_{21} & w_{22} & w_{23}\\ 
w_{31} & w_{32} & w_{33}\\ 
w_{41} & w_{42} & w_{43}\\ 
\end{pmatrix}=
\begin{pmatrix}
w_{11} & w_{12} & w_{13}
\end{pmatrix}
$$

One-Hot 会将词表中 Index=1 的词（对应的 Token 是“京”） 编码为 `[0, 1, 0, 0, 0]`。 这个向量与权重矩阵相乘，只取权重矩阵第2行的内容。 所以，`torch.nn.Embedding` 可以理解成一个没有 bias 的 `torch.nn.Linear` ，求词向量的过程是先对输入进行一个 One-Hot 转换，再进行 `torch.nn.Linear` 全连接矩阵乘法。全连接 `torch.nn.Linear` 中的权重就是一个形状为 `num_embeddings * embedding_dim` 的矩阵。

下面的代码使用 One-Hot 和矩阵相乘来模拟 Embedding :

```python
>>> import torch.nn.functional as F

>>> torch.matmul(F.one_hot(input, num_classes=5).float(), embedding.weight)
```

那么可以看到， Embedding 层就是以 One-Hot 为输入的全连接层！全连接层的参数，就是一个“词向量表”！或者说，Embedding 的查询过程是通过 One-Hot 的输入，以矩阵乘法的方式实现的。

## 如何得到词向量

既然 Embedding 就是全连接层，那如何得到 Embedding 呢？Embedding 层既然是一个全连接神经网络，神经网络当然是训练出来的。只是在得到词向量的这个训练过程中，有不同的训练目标。

我们可以直接把训练好的词向量拿过来用，比如 Word2Vec、GloVe 以及 Transformer ，这些都是一些语言模型，语言模型对应着某种训练目标。BERT 这样的预训练模型，在预训练阶段， Embedding 是随机初始化的，经过预训练之后，就可以得到词向量。比如 BERT 是在做完形填空，用周围的词预测被掩盖的词。语料中有大量“巴黎是法国的首都”的文本，把“巴黎”掩盖住：“[MASK]是法国的首都”，模型仍然能够将“[MASK]”预测为“巴黎”，说明词向量已经学得差不多了。

预训练好的词向量作为己用，可以用于下游任务。BERT 在微调时，会直接读取 Embedding 层的参数。预训练好的词向量上可以使用 Cosine 等方式，获得距离和相似度，语义相似的词有相似的词向量表示。这是因为，我们在用语言模型在预训练时，有窗口效应，通过前n个字预测下一个字的概率，这个n就是窗口的大小，同一个窗口内的词语，会有相似的更新，这些更新会累积，而具有相似模式的词语就会把这些相似更新累积到可观的程度。苏剑林在[文章](https://kexue.fm/archives/4122)中举了”忐忑“的例子，“忐”、“忑”这两个字，几乎是连在一起用的，更新“忐”的同时，几乎也会更新“忑”，因此它们的更新几乎都是相同的，这样“忐”、“忑”的字向量必然几乎是一样的。

预训练中，训练数据含有一些相似的语言模式。“相似的模式”指的是在特定的语言任务中，它们是可替换的，比如在一般的泛化语料中，“我喜欢你”中的“喜欢”，替换为“讨厌”后还是一个成立的句子，因此“喜欢”与“讨厌”虽然在语义上是两个相反的概念，但经过预训练之后，可能得到相似的词向量。

另外一种方式是从零开始训练。比如，我们有标注好的情感分类的数据，数据足够多，且质量足够好，我们可以直接随机初始化 Embedding 层，最后的训练目标是情感分类结果。Embedding 会在训练过程中自己更新参数。在这种情况下，词向量是通过情感分类任务训练的，“喜欢”与“讨厌”的词向量就会有差异较大。

## 一切皆可Embedding

Embedding 是经过了 One-Hot 的全连接层。除了词向量外，很多 Categorical 的特征也可以作为 Embedding。推荐系统中有很多 One-Hot 的特征，比如手机机型特征，可能有上千个类别。深度学习之前的线性模型直接对特征进行 One-Hot 编码，有些特征可能是上千维，上千维的特征里，只有一维是1，其他特征都是0，这种特征非常稠密。深度学习模型不适合这种稀疏的 One-Hot 特征，Embedding 可以将稀疏特征编码为低维的稠密特征。

一切皆可 Embedding，其实就是说 Embedding 用一个低维稠密的向量“表示”一个对象。

**参考资料**

1. 苏剑林. (Dec. 03, 2016). 《词向量与Embedding究竟是怎么回事？ 》[Blog post]. Retrieved from https://kexue.fm/archives/4122
---
title:  "PyTorch nn.Embedding 解读"
date:   2022-02-13 23:49:00 +0800
description: "Embedding 本质是一个查询矩阵，或者说是一个 dict 数据结构。以词向量为例， Embedding dict 的 Key 是词在词表中的索引位置（Index），Embedding dict 的 Value 是这个词的 `dim` 维的向量。"
categories: [PyTorch]
slug: pytorch-embedding-explained
--- 

Embedding 本质是一个查询矩阵，或者说是一个 dict 数据结构。以词向量为例， Embedding dict 的 Key 是词在词表中的索引位置（Index），Embedding dict 的 Value 是这个词的 `dim` 维的向量。

```python
embedding = torch.nn.Embedding(num_embeddings=5, embedding_dim=3)
input = torch.LongTensor([1])
print(embedding(input))
```

这里，`num_embeddings` 表示词表大小，即词表一共多少个词， `embedding_dim` 为词向量维度。在当前这个例子中，某个词被映射为3维的向量。

在这个例子中，经过 Embedding 层之后，输出是 Index 为1的词的3维词向量：

```
tensor([[ 2.0332, -0.8400,  0.8786]], grad_fn=<EmbeddingBackward>)
```

Embedding 里面是什么？是一个权重矩阵：

```python
print(embedding.weight)
```

输出是 Embedding 中的权重矩阵，是 `num_embeddings * embedding_dim` 大小的矩阵。

```
Parameter containing:
tensor([[ 1.6697, -0.4804, -0.8150],
        [ 2.0332, -0.8400,  0.8786],   <-- 刚才获取的 Index = 1 的词向量
        [ 1.5699,  0.0025,  0.4386],
        [-1.1474, -1.3720,  0.9855],
        [ 1.3635, -0.6749, -0.5666]], requires_grad=True)
```

刚才那个例子，查找 Index 为1的词向量 ，恰好是 Embedding 权重矩阵的第2行（从0计数的话则为第1行）。

权重矩阵如何做查询呢？ 答案是 One-Hot 。下面的代码 One-Hot 和矩阵相乘来模拟 Embedding :

```python
torch.matmul(F.one_hot(input, num_classes=5).float(), embedding.weight)
```

One-Hot 会将 `[1]` 编码为 `[0, 1, 0, 0, 0]`。 这个向量与权重矩阵相乘，只取权重矩阵第一行的内容。 所以，`nn.Embedding` 可以理解成一个没有 bias 的 `nn.Linear` ，只需要对 `nn.Linear` 的输入进行一个 One-Hot 转换。


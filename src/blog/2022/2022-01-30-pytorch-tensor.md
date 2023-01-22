---
title:  "PyTorch Tensor Operations"
date:   2022-01-30 16:19:00 +0800
description: ""
category: [深度学习]
permalink: /blog/pytorch-tensor-operations
# draft: true
--- 

使用PyTorch进行深度学习或者科学计算时，经常需要对 Tensor 进行各种变换。

## view

`view(*shape)`: Returns a new tensor with the same data as the `self` tensor but of a different `shape`.

`view(*shape)` 方法主要将 Tensor 的维度进行变换：假设原来的 Tensor 为 `x`，维度为 `shape_x`，经过 `y = x.view(shape)` 变换后， `x` 内的数据不变，但维度变换成 `shape` 。

```python
x = torch.randn(4, 4)
y = x.view(2, 8)
y.shape  # torch.Size([2, 8])
```

`view(shape)` 中的参数 `shape` 经常出现 `-1` 。 `-1` 表示该维度暂不指定，先确定其他维度，该维度大小由其他维度推测出来。

```python
x = torch.randn(4, 4)
y = x.view(-1, 8) # -1 意味着该维度由其他维度推测出来： 4 * 4 / 8 = 2
y.shape  # torch.Size([2, 8])
```

如果出现 `view(-1)` 则表示：将该 Tensor 变换为一个一维 Tensor。

```python
x = torch.randn(2, 4, 4)
y = x.view(-1) # 参数仅有 -1 意味着得到一个一维 Tensor，维度为： 2 * 4 * 4  = 32
y.shape  # torch.Size([32])
```

## slice：冒号+逗号+数字

经常看到代码中对张量 Tensor 使用冒号（:）进行操作。冒号是 Python 切片的操作符。常见形式为 `x[1:5]` ，表示取第1到第4个元素。`x[:]` 会让人非常迷茫，它表示该维度全要，不做任何切片操作。逗号用来表示不同的维度进行操作。

张量 `x` 维度为 `(M, N)` ，即一个 `M * N` 的矩阵。 `x[:, 0]` 表示取矩阵的第0列元素，`x[:, 1]` 表示矩阵的第1列的元素，得到的矩阵维度为 `(M, )`。`x[:,  m:n]` 即取矩阵x的所有行中的的第 `m` 到 `n-1` 列数据，含左不含右，得到的矩阵维度为 `(M, n-m)`。

```python
x = torch.randn(2, 4)
y = x[:, 0]
y.shape  # torch.Size([2])

y = x[:, 1:3]
y.shape  # torch.Size([2, 2])
```

高维张量 `x` 维度为 `(M, N, R, S)` 。 `x[:, 0]` ，更准确的形式应该是：`x[:, 0, :, :]`， 表示取张量第二维（数字N所在的维度）的第0列元素，`x[:, 1]` 表示取张量第二维（数字N所在的维度）的第1列的元素，得到的张量维度为： `(M, R, S)` 。`x[:,  m:n]` ，更准确的形式应该是：`x[:, m-n, :, :]`， 即取张量第二维（数字N所在的维度）第 `m` 到 `n-1` 列数据，含左不含右，得到的张量维度为： `(M, n-m, R, S)`。

```python
x = torch.randn(2, 4, 8, 6)
y = x[:, 0]
y.shape  # torch.Size([2, 8, 6])

y = x[:, 0, :, :]
y.shape  # torch.Size([2, 8, 6])

y = x[:, 1:4, :, :]
y.shape  # torch.Size([2, 3, 8, 6])
```

## stack & cat

`stack()`: Concatenates a sequence of tensors along a new dimension.

`stack()` 沿着一个新维度对输入张量序列进行拼接。
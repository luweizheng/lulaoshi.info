---
title: PyTorch的Tensor和自动求导
keywords: 神经网络, 深度学习, PyTorch
summary: ""

chapter-name: 神经网络
chapter-url: /machine-learning/neural-network/index.html
---

深度学习的基本流程是：设计神经网络结构，形成计算图，选择一个合适的损失函数，使用损失函数衡量预测值与真实值之间的差异。具体到一轮计算：我们需要将一个批次的数据喂给神经网络，神经网络前向传播（Forward），求得损失函数的值；然后是反向传播（Back Propagation）过程：求得损失函数对模型各参数的导数，利用梯度下降法来更新模型各参数。深度学习框架的最重要的一项功能就是帮我们完成了求导的过程。本文简单介绍一下PyTorch中张量Tensor以及其自动求导功能。

PyTorch的Tensor尽量兼容了NumPy的数据结构，除了可以像NumPy那样存储和计算张量外，Tensor还可以：

1. 被拷贝到GPU上进行计算加速。
2. 包含了自动求导的功能。

我们先看一下在PyTorch里Tensor的定义，以及如何创建Tensor。

```python
torch.tensor(data, *, dtype=None, device=None, requires_grad=False, pin_memory=False) → Tensor
```

如果想创建Tensor，需要使用`torch.tensor()`，其中：
* `data`是张量本身，可以是列表、元组、NumPy的`ndarray`，标量等等。
* `dtype`是数据类型，比如`float32`等。
* `device`指定存储该张量的的设备。这个变量主要是针对CPU/GPU异构编程，在CUDA这种异构编程体系里，CPU被称作主机（Host），某张GPU卡被称作设备（Device）。
* `requires_grad`表示是否需要求梯度（Gradient）或者说是否需要求导。如果设置为`True`，表示需要求导。默认这个值是`False`。

我们创建Tensor：

```python
x = torch.ones(2, 2, requires_grad=True)
y = x + 2
z = y * y * 3
out = z.mean()

print(x)
print(y)
print(z)
print(out)
```

输出：
```
tensor([[1., 1.],
        [1., 1.]], requires_grad=True)
tensor([[3., 3.],
        [3., 3.]], grad_fn=<AddBackward0>)
tensor([[27., 27.],
        [27., 27.]], grad_fn=<MulBackward0>)
tensor(27., grad_fn=<MeanBackward0>)
```

这里，我们可以将`x`假想成神经网络的输入，`y`是神经网络的隐藏层，`z`是神经网络的输出，最后的`out`是损失函数；或者说我们建立了一个简单的计算图，数据从`x`流向`out`。可以看到，只要`x`设置了`requires_grad=True`，那么计算图后续的节点用`grad_fn`记录了计算图中各步的传播过程。

现在，我们从`out`开始进行反向传播：

```python
out.backward()
```

执行完`.backward()`后，PyTorch帮我们把计算图中的梯度都计算好了，如下：

```python
print(x.grad)
```

输出：

```
tensor([[4.5000, 4.5000],
        [4.5000, 4.5000]])
```

拓展到深度学习，从输入开始，每层都有大量参数`W`和`b`，这些参数也是Tensor结构。给Tensor设置了`requires_grad=True`后，PyTorch会跟踪Tensor之后的所有计算，经过`.backward()`后，PyTorch自动帮我们计算损失函数对于这些参数的梯度，梯度存储在了`.grad`属性里，PyTorch会按照梯度下降法更新参数。

在PyTorch中，`.backward()`方法默认只会对计算图中的叶子节点求导。在上面的例子里，`x`就是叶子节点，`y`和`z`都是中间变量，他们的`.grad`属性都是`None`。而且，PyTorch目前只支持浮点数的求导。

另外，PyTorch的自动求导一般只是**标量**对**向量/矩阵**求导。在深度学习中，最后的损失函数一般是一个标量值，是样本数据经过前向传播得到的损失值的和，而输入数据是一个向量或矩阵。在刚才的例子中，`y`是一个矩阵，`.mean()`对`y`求导，得到的是标量。
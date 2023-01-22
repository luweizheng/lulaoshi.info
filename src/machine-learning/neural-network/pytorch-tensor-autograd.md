---
title: PyTorch的Tensor和自动求导
order: 3
head:
  - - meta
    - name: keywords
      content: 神经网络, 深度学习, PyTorch, 自动微分，求导
description: "PyTorch Tensor和自动求导入门。"
category: [机器学习]
tag: [PyTorch]
article: false
---

深度学习的基本流程是：设计神经网络结构，形成计算图，选择一个合适的损失函数，使用损失函数衡量预测值与真实值之间的差异。具体到一轮计算：我们需要将一个批次的数据喂给神经网络，神经网络前向传播（Forward），求得损失函数的值；然后是反向传播（Back Propagation）过程：求得损失函数对模型各参数的导数，利用梯度下降法来更新模型各参数。深度学习框架的最重要的一项功能就是帮我们完成了求导的过程。本文简单介绍一下PyTorch中张量Tensor以及其自动求导功能。

## PyTorch中的Tensor

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

## Tensor与自动求导

下面是一个使用PyTorch训练神经网络的例子。在这个例子中，我们随机初始化了输入`x`和输出`y`，分别作为模型的特征和要拟合的目标值。这个模型有两层，第一层是输入层，第二层为隐藏层，模型的前向传播如下所示：
$$
H = ReLU(W^{[1]}X) \\
Y = W^{[2]} H
$$

```python
dtype = torch.float
device = torch.device("cpu") # 使用CPU
# device = torch.device("cuda:0") # 如果使用GPU，请打开注释

# N: batch size
# D_in: 输入维度
# H: 隐藏层
# D_out: 输出维度 
N, D_in, H, D_out = 64, 1000, 100, 10

# 初始化随机数x, y
# x, y用来模拟机器学习的输入和输出
x = torch.randn(N, D_in, device=device, dtype=dtype)
y = torch.randn(N, D_out, device=device, dtype=dtype)

# 初始化模型的参数w1和w2
# 均设置为 requires_grad=True
# PyTorch会跟踪w1和w2上的计算，帮我们自动求导
w1 = torch.randn(D_in, H, device=device, dtype=dtype, requires_grad=True)
w2 = torch.randn(H, D_out, device=device, dtype=dtype, requires_grad=True)

learning_rate = 1e-6
for t in range(500):
    # 前向传播过程：
    # h1 = relu(x * w1)
    # y = h1 * w2
    y_pred = x.mm(w1).clamp(min=0).mm(w2)

    # 计算损失函数loss
    # loss是误差的平方和
    loss = (y_pred - y).pow(2).sum()
    if t % 100 == 99:
        print(t, loss.item())

    # 反向传播过程：
    # PyTorch会对设置了requires_grad=True的Tensor自动求导，本例中是w1和w2
    # 执行完backward()后，w1.grad 和 w2.grad 里存储着对于loss的梯度
    loss.backward()

    # 根据梯度，更新参数w1和w2
    with torch.no_grad():
        w1 -= learning_rate * w1.grad
        w2 -= learning_rate * w2.grad

        # 将 w1.grad 和 w2.grad 中的梯度设为零
        # PyTorch的backward()方法计算梯度会默认将本次计算的梯度与.grad中已有的梯度加和
        # 必须在下次反向传播前先将.grad中的梯度清零
        w1.grad.zero_()
        w2.grad.zero_()
```

在这个例子中，我们对`w1`和`w2`设置了`requires_grad=True`，损失函数是`loss`，PyTorch会自动跟踪这两个变量上的计算，当执行`backward()`时，PyTorch帮我们计算了`loss`对于`w1`和`w2`的导数。每次迭代后，我们都要根据导数，更新`w1`和`w2`。PyTorch的backward()方法计算梯度会默认将本次计算的梯度与.grad中已有的梯度加和，下次迭代前，需要将.grad中的梯度清零，否则影响下一轮迭代的梯度值。经过多轮训练，模型的`loss`不断变小。

以上就是使用PyTorch的Tensor和自动求导来构建神经网络模型的过程。

**参考资料**

1. [https://pytorch.org/tutorials/beginner/pytorch_with_examples.html](https://pytorch.org/tutorials/beginner/pytorch_with_examples.html)
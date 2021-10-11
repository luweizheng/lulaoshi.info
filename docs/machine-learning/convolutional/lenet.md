---
title: LeNet：一个简单的卷积神经网络
keywords: 
    - 神经网络
    - 深度学习
    - 卷积神经网络
    - 卷积
    - LeNet
description: "LeNet是一个最简单的卷积神经网络，卷积神经网络包含卷积块部分和全连接层部分。卷积块包括一个卷积层和一个池化层。"
---

前两篇文章分别介绍了[卷积层](./two-dimension-convolution-layer.md)和[池化层](./pooling.md)，卷积和池化是卷积神经网络必备的两大基础。本文我们将介绍一个早期用来识别手写数字图像的卷积神经网络：LeNet[1]。LeNet名字来源于论文的第一作者Yann LeCun。1989年，LeNet使用卷积神经网络和梯度下降法，使得手写数字识别达到当时领先水平。这个奠基性的工作第一次将卷积神经网络推上历史舞台，为世人所知。由于LeNet的出色表现，在很多ATM取款机上，LeNet被用来识别数字字符。

本文基于PyTorch和TensorFlow 2的代码已经放在了我的[GitHub](https://github.com/luweizheng/machine-learning-notes/tree/master/neural-network/cnn)上。

## 网络模型结构

LeNet的网络结构如下图所示。

![LetNet网络结构](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-11-23-075905.png)
*LetNet网络结构*

LeNet分为卷积层块和全连接层块两个部分。

卷积层块里的基本单位是卷积层后接最大池化层：卷积层用来识别图像里的空间模式，如线条和物体局部，之后的最大池化层则用来降低卷积层对位置的敏感性。卷积层块由卷积层加池化层两个这样的基本单位重复堆叠构成。在卷积层块中，每个卷积层都使用5×5的窗口，并在输出上使用Sigmoid激活函数。整个模型的输入是1维的黑白图像，图像尺寸为28×28。第一个卷积层输出通道数为6，第二个卷积层输出通道数则增加到16。这是因为第二个卷积层比第一个卷积层的输入的高和宽要小，所以增加输出通道使两个卷积层的参数尺寸类似。卷积层块的两个最大池化层的窗口形状均为2×2，且步幅为2。由于池化窗口与步幅形状相同，池化窗口在输入上每次滑动所覆盖的区域互不重叠。

我们通过PyTorch的`Sequential`类来实现LeNet模型。

```python
class LeNet(nn.Module):
    def __init__(self):
        super(LeNet, self).__init__()
        
        # 输入 1 * 28 * 28
        self.conv = nn.Sequential(
            # 卷积层1
            # 在输入基础上增加了padding，28 * 28 -> 32 * 32
            # 1 * 32 * 32 -> 6 * 28 * 28
            nn.Conv2d(in_channels=1, out_channels=6, kernel_size=5, padding=2), nn.Sigmoid(),
            # 6 * 28 * 28 -> 6 * 14 * 14
            nn.MaxPool2d(kernel_size=2, stride=2), # kernel_size, stride
            # 卷积层2
            # 6 * 14 * 14 -> 16 * 10 * 10 
            nn.Conv2d(in_channels=6, out_channels=16, kernel_size=5), nn.Sigmoid(),
            # 16 * 10 * 10 -> 16 * 5 * 5
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        self.fc = nn.Sequential(
            # 全连接层1
            nn.Linear(in_features=16 * 5 * 5, out_features=120), nn.Sigmoid(),
            # 全连接层2
            nn.Linear(in_features=120, out_features=84), nn.Sigmoid(),
            nn.Linear(in_features=84, out_features=10)
        )

    def forward(self, img):
        feature = self.conv(img)
        output = self.fc(feature.view(img.shape[0], -1))
        return output
```

我们有必要梳理一下模型各层的参数。输入形状为通道数为1的图像（1维黑白图像），尺寸为28×28，经过第一个5×5的卷积层，卷积时上下左右都使用了2个元素作为填充，输出形状为：(28 - 5 + 4 + 1) × (28 - 5 + 4 + 1) = 28 × 28。第一个卷积层输出共6个通道，输出形状为：6 × 28 × 28。最大池化层核大小2×2，步幅为2，高和宽都被折半，形状为：6 × 14 × 14。第二个卷积层的卷积核也为5 × 5，但是没有填充，所以输出形状为：(14 - 5 + 1) × (14 - 5 + 1) = 10 × 10。第二个卷积核的输出为16个通道，所以变成了 16 × 10 × 10。经过最大池化层后，高和宽折半，最终为：16 × 5 × 5。

卷积层块的输出形状为(batch_size, output_channels, height, width)，在本例中是(batch_size, 16, 5, 5)，其中，batch_size是可以调整大小的。当卷积层块的输出传入全连接层块时，全连接层块会将一个batch中每个样本变平（flatten）。原来是形状是：(通道数 × 高 × 宽)，现在直接变成一个长向量，向量长度为通道数 × 高 × 宽。在本例中，展平后的向量长度为：16 × 5 × 5 = 400。全连接层块含3个全连接层。它们的输出个数分别是120、84和10，其中10为输出的类别个数。

## 训练模型

基于上面的网络，我们开始训练模型。我们使用Fashion-MNIST作为训练数据集，很多框架，比如PyTorc提供了Fashion-MNIST数据读取的模块，我做了一个简单的封装：

```python
def load_data_fashion_mnist(batch_size, resize=None, root='~/Datasets/FashionMNIST'):
    """Use torchvision.datasets module to download the fashion mnist dataset and then load into memory."""
    trans = []
    if resize:
        trans.append(torchvision.transforms.Resize(size=resize))
    trans.append(torchvision.transforms.ToTensor())
    
    transform = torchvision.transforms.Compose(trans)
    mnist_train = torchvision.datasets.FashionMNIST(root=root, train=True, download=True, transform=transform)
    mnist_test = torchvision.datasets.FashionMNIST(root=root, train=False, download=True, transform=transform)
    if sys.platform.startswith('win'):
        num_workers = 0  
    else:
        num_workers = 4
    train_iter = torch.utils.data.DataLoader(mnist_train, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    test_iter = torch.utils.data.DataLoader(mnist_test, batch_size=batch_size, shuffle=False, num_workers=num_workers)

    return train_iter, test_iter
```

`load_data_fashion_mnist()`方法返回训练集和测试集。

在训练过程中，我们希望看到每一轮迭代的准确度，构造一个`evaluate_accuracy`方法，计算当前一轮迭代的准确度（模型预测值与真实值之间的误差大小）：

```python
def evaluate_accuracy(data_iter, net, device=None):
    if device is None and isinstance(net, torch.nn.Module):
        device = list(net.parameters())[0].device
    acc_sum, n = 0.0, 0
    with torch.no_grad():
        for X, y in data_iter:
            if isinstance(net, torch.nn.Module):
                # set the model to evaluation mode (disable dropout)
                net.eval() 
                # get the acc of this batch
                acc_sum += (net(X.to(device)).argmax(dim=1) == y.to(device)).float().sum().cpu().item()
                # change back to train mode
                net.train() 

            n += y.shape[0]
    return acc_sum / n
```

接着，我们可以构建一个`train()`方法，用来训练神经网络：

```python
def try_gpu(i=0):
    if torch.cuda.device_count() >= i + 1:
        return torch.device(f'cuda:{i}')
    return torch.device('cpu')

def train(net, train_iter, test_iter, batch_size, optimizer, num_epochs, device=try_gpu()):
    net = net.to(device)
    print("training on", device)
    loss = torch.nn.CrossEntropyLoss()
    batch_count = 0
    for epoch in range(num_epochs):
        train_l_sum, train_acc_sum, n = 0.0, 0.0, 0
        for X, y in train_iter:
            X = X.to(device)
            y = y.to(device)
            y_hat = net(X)
            l = loss(y_hat, y)
            optimizer.zero_grad()
            l.backward()
            optimizer.step()
            train_l_sum += l.cpu().item()
            train_acc_sum += (y_hat.argmax(dim=1) == y).sum().cpu().item()
            n += y.shape[0]
            batch_count += 1
        test_acc = evaluate_accuracy(test_iter, net)
        if epoch % 10 == 0:
            print(f'epoch {epoch + 1} : loss {train_l_sum / batch_count:.3f}, train acc {train_acc_sum / n:.3f}, test acc {test_acc:.3f}')
```

在整个程序的主逻辑中，设置必要的参数，读入训练和测试数据并开始训练：

```python
def main():

    batch_size = 256
    lr, num_epochs = 0.9, 100

    net = LeNet()
    optimizer = torch.optim.SGD(net.parameters(), lr=lr)
    
    # load data
    train_iter, test_iter = load_data_fashion_mnist(batch_size=batch_size)
    # train
    train(net, train_iter, test_iter, batch_size, optimizer, num_epochs)
```

## 小结

1. LeNet是一个最简单的卷积神经网络，卷积神经网络包含卷积块部分和全连接层部分。
2. 卷积块包括一个卷积层和一个池化层。

**参考文献**

1. LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P. (1998). Gradient-based learning applied to document recognition. Proceedings of the IEEE, 86(11), 2278-2324.

2. [http://d2l.ai/chapter_convolutional-neural-networks/lenet.html](http://d2l.ai/chapter_convolutional-neural-networks/lenet.html)

3. [https://tangshusen.me/Dive-into-DL-PyTorch/#/chapter05_CNN/5.5_lenet](https://tangshusen.me/Dive-into-DL-PyTorch/#/chapter05_CNN/5.5_lenet)
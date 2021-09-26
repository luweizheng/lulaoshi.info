---
title: VGG：使用基础卷积块的网络
keywords: 神经网络, 深度学习, 卷积神经网络, 卷积, 二维卷积层, 卷积核, 池化层
description: ""

chapter-name: 卷积神经网络
chapter-url: /machine-learning/neural-network/index.html
---

[AlexNet](./alexnet.html)在[LeNet](./lenet.html)的基础上增加了卷积层，但AlexNet对卷积窗口、输出通道数和构造顺序均做了大量的调整。虽然AlexNet指明了深度卷积神经网络有出色的表现，但并没有提供简单的规则以指导后来的研究者如何设计新的网络。

VGG网络是Oxford的**V**isual **G**eometry **G**roup组提出的，VGG网络是实验室名字的缩写。VGG论文阐述了其在ImageNet 2014挑战赛上的一些发现，提出了可以通过重复使用基础块（Block）来构造深度模型。

## VGG块

一般地，构建CNN基础块的规律是：

1. 一个卷积层
2. 一个非线性激活函数，例如ReLU
3. 一个池化层，例如最大池化层

VGG论文中提出的方法是：连续使用数个相同的填充为1、窗口形状为3 × 3的卷积层后紧接一个步幅为2、窗口形状为2 × 2​的最大池化层。卷积层保持输入和输出的高和宽不变，而池化层对输入的尺寸减半。

对于给定的感受野（与输出有关的输入图片的局部大小），采用堆积的小卷积核优于采用大的卷积核，因为增加网络深度可以保证网络能学习到更复杂的模式，而且整个模型的参数更少，代价还比较小。

我们使用`vgg_block()`方法来实现这个基础的VGG块，这个方法有几个参数：该块中卷积层的数量、输入输出通道数。

```python
def vgg_block(num_convs, in_channels, out_channels):
    '''
    Returns a block of convolutional neural network

        Parameters:
            num_convs (int): number of convolutional layers this block has
            in_channels (int): input channel number of this block
            out_channels (int): output channel number of this block

        Returns:
            a nn.Sequential network: 
    '''
    layers=[]
    for _ in range(num_convs):
        # (input_shape - 3 + 2 + 1) / 1 = input_shape
        layers.append(nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1))
        layers.append(nn.ReLU())
        in_channels = out_channels
    # (input_shape - 2 + 2) / 2 = input_shape / 2
    layers.append(nn.MaxPool2d(kernel_size=2,stride=2))
    return nn.Sequential(*layers)
```

## VGG网络

VGG与AlexNet、LeNet类似，VGG网络分为两大部分，前半部分是卷积层和池化层模块，后半部分是全连接层模块。

![从AlexNet到VGG：使用基础块构建深度神经网络](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-12-09-090434.png){:width="800" .align-center}
*从AlexNet到VGG：使用基础块构建深度神经网络*

卷积层和池化层模块由多个基础块连接组成，即`vgg_block()`方法返回的基础块，我们只需要给`vgg_block()`方法提供：该块中包含的卷积层数，该块的输入和输出通道数。我们定义变量`conv_arch`，该变量是一个列表，列表中每个元素为元组（a list of tuples）。`conv_arch`定了每个VGG块里卷积层个数和输入输出通道数。全连接层模块则跟AlexNet中的一样。下面的`vgg()`方法会返回整个VGG网络，输入参数是`conv_arch`。

```python
def vgg(conv_arch):
    '''
    Returns the VGG network

        Parameters:
            conv_arch ([(int, int)]): a list which contains vgg block info.
                the first element is the number of convolution layers this block have.
                the latter element is the output channel number of this block.

        Returns:
            a nn.Sequential network: 
    '''
    # The convolutional part
    conv_blks=[]
    in_channels=1
    for (num_convs, out_channels) in conv_arch:
        conv_blks.append(vgg_block(num_convs, in_channels, out_channels))
        in_channels = out_channels

    return nn.Sequential(
        *conv_blks, nn.Flatten(),
        # The fully-connected part
        nn.Linear(out_channels * 7 * 7, 4096), nn.ReLU(), nn.Dropout(0.5),
        nn.Linear(4096, 4096), nn.ReLU(), nn.Dropout(0.5),
        nn.Linear(4096, 10))
```

现在我们构造一个VGG网络。它有5个卷积块，前2块使用单卷积层，而后3块使用双卷积层。第一块的输入输出通道分别是1和64，第一块的输入通道数根据所使用的数据集而定，Fashion-MNIST数据的通道数为1，对于ImageNet等数据集，输入通道数一般为3。之后每次对输出通道数翻倍，直到变为512。因为这个网络使用了8个卷积层和3个全连接层，所以经常被称为VGG-11。

在代码层面，定义变量`conv_arch`，中间包含多个元组，每个元组第一个元素为该块的卷积层个数，第二个元素为输出通道数。

```python
conv_arch = ((1, 64), (1, 128), (2, 256), (2, 512), (2, 512))

net = vgg(conv_arch)
```

模型的训练过程与之前分享的LeNet、AlexNet基本相似。源代码已经发布到了[GitHub](https://github.com/luweizheng/machine-learning-notes/blob/master/neural-network/cnn/pytorch/vgg-fashionmnist.py)。

## 小结

1. VGG通过多个基础卷积块来构造网络。基础块需要定义卷积层个数和输入输出通道数。
2. VGG论文认为，更小（例如3 × 3）的卷积层比更大的卷积层效率更高，因为可以增加更多的层，同时参数又不至于过多。

**参考资料**

1. Simonyan, K., & Zisserman, A. (2014). Very deep convolutional networks for large-scale image recognition.
2. [http://d2l.ai/chapter_convolutional-modern/vgg.html](http://d2l.ai/chapter_convolutional-modern/vgg.html)
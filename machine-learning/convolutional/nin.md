---
title: NiN：使用1×1卷积层替代全连接层
keywords: 神经网络, 深度学习, 卷积神经网络, 卷积, 二维卷积层, 卷积核, 池化层
description: "NiN重复使用NiN基础块构建网络，NiN基础块由卷积层和代替全连接层的1 × 1卷积层构成。NiN去除了容易造成过拟合的全连接层。在最后的输出部分，输出通道数等于标签类别数，再使用全局平均池化层获得最后的分类结果。去除全连接层后，模型参数大小也显著减小。"
---
{% katexmm %}

LeNet、AlexNet、VGG网络的主要模式为：先使用卷积层来抽取图片的空间特征，再使用全连接层，最后输出分类结果。颜水成等人提出了网络中的网络（Network in Network）,从另外一个角度来构建卷积层和全连接层。

## 1×1卷积层

我们知道，卷积层一般需要设置高和宽，它会识别卷积窗口内的图片特征。如果卷积层的高和宽恰好是1，那么计算模式如下：

![1×1卷积层](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-12-15-022434.png){:width="600" .align-center}
*1×1卷积层*

图中，卷积核有3个输入频道，2个输出频道，$（K_{0,0}, K_{0,1}, K_{0,2})$对应输出的第一个通道的参数，$（K_{1,0}, K_{1,1}, K_{1,2})$对应输出的第二个通道的参数。输出由输入的浅色部分与卷积核浅色部分逐一相乘，如下：
$$
I_{0, i, j} \times K_{0, 0} + I_{1, i, j} \times K_{0, 1} + I_{2, i, j} \times K_{0, 2}
$$
我们可以将$(I_{0, i, j}, I_{1, i, j}, I_{2, i, j})$等输入在不同通道上的向量理解成MLP网络中的特征，将$(K_{0, 0}, K_{0, 1}, K_{0, 2})$等理解成MLP网络中的权重参数，特征与权重逐一相乘，这与全连接层的运算几乎一致。那么，1×1卷积层可用来完成全连接层所需要完成的工作。

经过1×1卷积层后，高和宽是不变的，变化的是通道的数目。在上面的例子中，输出通道数为2，输出的高和宽不变，通道数变成了2。

## NiN

NiN主要使用1×1卷积层来替代全连接层，它与LeNet/AlexNet/VGG等网络区别如下图所示：

![NiN使用1×1卷积层替代全连接层](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-12-15-022440.png){:width="600" .align-center}
*NiN使用1×1卷积层替代全连接层*

与VGG相似，NiN也提出了基础块的概念，一个NiN基础块由普通卷积层和2个1×1卷积层组合而成。

```python
def nin_block(in_channels, out_channels, kernel_size, strides, padding):
    return nn.Sequential(
        nn.Conv2d(in_channels, out_channels, kernel_size, strides, padding),
        nn.ReLU(),
        nn.Conv2d(out_channels, out_channels, kernel_size=1), nn.ReLU(),
        nn.Conv2d(out_channels, out_channels, kernel_size=1), nn.ReLU())
```

网络的结构如下图所示：

![VGG和NiN网络结构](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-12-15-022445.png){:width="800" .align-center}
*VGG和NiN网络结构*

我们基于Fashion-MNIST数据集，输入通道数为1，构建一个NiN网络。NiN网络共有四个基础块：

* 第一个基础块由11×11的卷积层和2个1×1卷积层组成
* 第二个基础块由5×5的卷积层和2个1×1卷积层组成
* 第三个基础块由3×3的卷积层和2个1×1卷积层组成
* 第四个基础块由3×3的卷积层和2个1×1卷积层组成

NiN去掉了LeNet/AlexNet/VGG最后的全连接层，取而代之地，NiN使用了输出通道数等于标签类别数的NiN块，然后使用全局平均池化层对每个通道中所有元素求平均并直接用于分类。经过最后一个基础块后，数据维度变为 10 × 5  × 5，10为通道数，也是分类标签数。我们需要使用全局平均池化层，将5×5的矩阵转化为1×1（一个标量）。

NiN的设计可以显著减小模型参数尺寸，从而缓解过拟合。然而，该设计有时会造成获得有效模型的训练时间的增加。

```python
def nin():
    '''
    Returns the NiN network
    '''
    # Fashion-MNIST 1 * 28 * 28, resize into the input into 1 * 224 * 224
    # input shape: 1 * 224 * 224
    net = nn.Sequential(
        # 1 * 224 * 224 -> 96 * 54 * 54
        nin_block(1, 96, kernel_size=11, strides=4, padding=0),
        # 96 * 54 * 54 -> 96 * 26 * 26
        nn.MaxPool2d(kernel_size=3, stride=2),
        # 96 * 26 * 26 -> 256 * 26 * 26
        nin_block(96, 256, kernel_size=5, strides=1, padding=2),
        # 256 * 26 * 26 -> 256 * 12 * 12
        nn.MaxPool2d(3, stride=2),
        # 256 * 12 * 12 -> 384 * 12 * 12
        nin_block(256, 384, kernel_size=3, strides=1, padding=1),
        # 384 * 12 * 12 -> 384 * 5 * 5
        nn.MaxPool2d(3, stride=2),
        nn.Dropout(0.5),
        # 384 * 5 * 5 -> 10 * 5 * 5
        nin_block(384, 10, kernel_size=3, strides=1, padding=1),
        # 10 * 5 * 5 -> 10 * 1 * 1
        nn.AdaptiveAvgPool2d((1, 1)),
        # get the final classification result
        nn.Flatten())

    return net
```

模型的训练过程与之前分享的LeNet、AlexNet、VGG基本相似，所有代码放在了[GitHub](https://github.com/luweizheng/machine-learning-notes/blob/master/neural-network/cnn/pytorch/nin-fashionmnist.py)上。

{% endkatexmm %}
## 小结

* NiN重复使用NiN基础块构建网络，NiN基础块由卷积层和代替全连接层的1 × 1卷积层构成。
* NiN去除了容易造成过拟合的全连接层。在最后的输出部分，输出通道数等于标签类别数，再使用全局平均池化层获得最后的分类结果。去除全连接层后，模型参数大小也显著减小。
* NiN的以上设计思想影响了后面一系列卷积神经网络的设计。

**参考资料**
1. Lin, M., Chen, Q., & Yan, S. (2013). Network in network.
2. [http://d2l.ai/chapter_convolutional-modern/nin.html](http://d2l.ai/chapter_convolutional-modern/nin.html)
3. [https://tangshusen.me/Dive-into-DL-PyTorch/#/chapter05_CNN/5.8_nin](https://tangshusen.me/Dive-into-DL-PyTorch/#/chapter05_CNN/5.8_nin)
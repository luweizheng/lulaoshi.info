---
title: 正则化：防止模型过拟合
keywords: 岭回归, Ridge, Lasso, 线性回归, 正则化, L1正则化, L2正则化, 范数, 稀疏特征, 稀疏解
summary: ""

chapter-name: 线性模型
chapter-url: /machine-learning/linear-model/index.html
---

{% katexmm %}

为了避免过拟合，一种手段是使用正则化（Regularizaiton）来限制模型的复杂程度。Regularization从英文直译过来是“规则化”，就是说，在原来的问题求解条件上加一些规则限制，避免模型过于复杂，出现过拟合的情况。

## 岭回归 Ridge Regression

很多机器学习模型求解模型参数$\boldsymbol{w}$，以让损失函数最小。例如，对于一个有$m$条样本的训练集，线性回归的损失函数为：

$$
\begin{aligned}
L(\boldsymbol{w}) &= \frac{1}{2}\sum_{i=1}^m(f_\boldsymbol{w}(\boldsymbol{x}^{(i)}) - y^{(i)})^2 \\ 
&= \frac{1}{2}\sum_{i=1}^m(\boldsymbol{w}^\top\boldsymbol{x}^{(i)} - y^{(i)})^2
\end{aligned}
$$

在上面公式基础上，我们添加一个正则项，得到一个新的损失函数：
$$
L(\boldsymbol{w}) = \frac{1}{2}\left(\sum_{i=1}^m(\boldsymbol{w}^\top\boldsymbol{x}^{(i)} - y^{(i)})^2 + \lambda\sum_{j=1}^nw_j^2\right)
$$
注意，模型的$\boldsymbol{w}$有$n$维，新增加的正则项直接对每个$w$取平方。

直观上来讲，当我们最小化当前这个新的损失函数的时候，一方面要使线性回归本身的误差项$\sum_{i=1}^m(\boldsymbol{w}^\top\boldsymbol{x}^{(i)}-y^{(i)})^2$最小化，另一方面，每个$w$不能太大，否则正则项$\lambda\sum_{j=1}^nw_j^2$会很大。正则项又被称为惩罚项，用来惩罚各个$w$过大导致的模型过于复杂的情况。正则项中的$\lambda$是用来平衡损失函数和正则项之间的系数，被称为正则化系数，系数越大，正则项的惩罚效果越强，后文还会提到正则化系数。

对于刚刚得到的新损失函数，我们可以对这个公式进行求导，以得到梯度，进而可以使用梯度下降法求解。
$$
\frac \partial {\partial w_j}L(w) = \sum_{i=1}^m(\boldsymbol{w}^\top\boldsymbol{x}^{(i)} - y^{(i)})x_{j}^{(i)} + \lambda w_j
$$

线性回归使用二次正则项来惩罚参数$\boldsymbol{w}$的整个过程被称为岭回归（Ridge Regression），或者说使用了L2正则化（L2 Regularization）。其他机器学习模型如逻辑回归和神经网络也可以使用L2正则化。

## Lasso回归 Lasso Regression

如果使用一次正则项来惩罚线性回归的参数$\boldsymbol{w}$，被称为Lasso(Least Absolute Shrinkage and Selection Operator) Regression，或者说回归使用了L1正则化：
$$
L(\boldsymbol{w}) = \frac{1}{2}\left(\sum_{i=1}^m(\boldsymbol{w}^\top\boldsymbol{x} - y)^2 + \lambda\sum_{j=1}^n|w_j|\right)
$$
可以看到，Lasso回归主要是使用绝对值来做惩罚项。绝对值项在零点有一个突变，它的求导稍微麻烦一些。Lasso回归求解需要用到次梯度（Subgradient）方法，或者使用近端梯度下降（Promximal Gradient Descent，PGD）法，这里不再赘述。

## 一般正则项

正则项来源于于线性代数中范数（Norm）的概念。范数是一个函数，对于函数$N$，有$V \rarr [0, +\infty)$，其中，$V$是一个向量空间。也就是说，范数将向量转换为一个非负数标量。常见的范数有：

![范数](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-06-06-024121.png)

## 稀疏解与L1正则化

如果训练数据属于高维稀疏（Sparse）特征，比如说一个100,000,000维特征中只有1,000维是非零的，剩下特征都是0或者是空，这样训练出来的模型中参数$\boldsymbol{w}$很可能很多都接近0。在房价预测中，如果我们想使用房屋的经纬度特征，具体而言，假设全球纬度可以被切分为10,000份，经度可以被切分为10,000份，一座房子的地理位置可以用经纬度交叉表示为“经度1001_维度999”，房子在这个位置该特征标记为1，否则该特征标记为0。整个模型中关于经纬度的特征就达到了100,000,000维。实际上，我们知道，除了城市以外，绝大多数的地区并没有人居住，比如高山和海洋等地区，模型中地理位置特征参数绝大多数其实都应该为零。如果我们将参数$\boldsymbol{w}$都保存下来，模型非常大，占用大量内存空间。实际上，也没必要将那些没用的参数都保存下来，如果我们将这些无用参数都置为零，只记录有用的参数，那么模型所占用的空间将大大缩小。模型参数的零分量非常多的解被称为稀疏解。

正则化正好可以解决上述问题。一种方法是使用一个惩罚项来统计模型中非零参数的个数，即希望模型$\boldsymbol{w}$的零分量尽可能多，非零分量尽可能少。这种方法比较直观，它实际上是L0范数，但在求解时，这种方法会将一个凸优化问题变成非凸优化问题，不方便求解。L2正则化增加平方惩罚项，会让参数尽可能小，但不会强制参数为零。L1正则化也会惩罚非零参数，能在一定程度上让一些接近零的参数最终为零，近似起到L0的作用。从梯度下降的角度来讲，L2是平方项$w^2$，其导数是$2w$，按照导数的方向进行梯度下降，可能不会降到绝对值零；L1是绝对值项$|w|$，绝对值项能够迫使那些接近零的参数最终为零。

![L1和L2正则化的区别 来源：Google Developers](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-06-06-012006.png)
*L1和L2正则化的区别 来源：Google Developers*

上图是一个8维参数模型，经过训练后可以看到，L1正则化更容易让接近零的参数最终归为零。

我们再从可视化的角度来理解L1和L2正则化。假定我们的线性回归模型只有两维特征，确切地说，$\boldsymbol{w}$只有两个分量$w_1$和$w_2$，我们将其作为两个坐标轴，绘制平方误差项与正则项的等值线，如下图所示。

![L1正则化比L2正则化更容易使得参数为零 来源：《机器学习》](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-06-06-012012.png)
*L1正则化比L2正则化更容易使得参数为零 来源：《机器学习》*

其中，右上角为平方误差项的等值线，是平方误差项取值相同的点的连线；坐标轴中心为正则项的等值线，是在$(w_1, w_2)$空间中正则项取值相同的点的连线。如果没有正则项，那么最优解应该是平方误差项等值线的中心，即平方误差项最小的点。有了正则项，最优解是平方误差项和正则项的折中，即图中的相交处。从图中可以看出，L1正则的交点在坐标轴上，即$w_1$或$w_2$为0，而L2正则的交点不容易在坐标轴上。

## 正则化系数

下面的公式对正则化做了一个更一般的定义：
$$
minimize\left(Loss(Data|Model)) + \lambda \times complexity(Model) \right)
$$
正则化系数$\lambda$努力平衡训练数据的拟合程度和模型本身的复杂程度：

* 如果正则化系数过大，模型可能比较简单，但是有欠拟合的风险。模型可能没有学到训练数据中的一些特性，预测时也可能不准确。
* 如果正则化系数过小，模型会比较复杂，但是有过拟合的风险。模型努力学习训练数据的各类特性，但泛化预测能力可能不高。
* 理想的正则化系数可以让模型有很好的泛化能力，不过，正则化系数一般与训练数据、业务场景等具体问题相联系，因此需要通过调参找到一个较优的选项。

## 练习和巩固

关于正则化的不同选项和参数，可以在TensorFlow Playground里做一些尝试，观察不同选项对结果造成的差异。网址：http://playground.tensorflow.org/

![TensorFlow Playground](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-06-06-021516.png)
*TensorFlow Playground*

{% endkatexmm %}

**参考资料**

1. Andrew Ng：CS229 Lecture Notes
2. Ian Goodfellow and Yoshua Bengio and Aaron Courville: 《Deep Learning》
3. 周志华：《机器学习》
4. https://stanford.edu/~shervine/teaching/cs-229/cheatsheet-machine-learning-tips-and-tricks
5. https://developers.google.com/machine-learning/crash-course/regularization-for-sparsity/l1-regularization
6. https://developers.google.com/machine-learning/crash-course/regularization-for-simplicity/l2-regularization
7. https://developers.google.com/machine-learning/crash-course/regularization-for-simplicity/lambda
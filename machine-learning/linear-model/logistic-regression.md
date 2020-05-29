---
title: Logistic Regression
keywords: Logistic Regression, 最大似然估计, 逻辑回归, 逻辑斯蒂回归
summary: ""

chapter-name: 线性模型
chapter-url: /machine-learning/linear-model/index.html
---

> Logistic Regression曾经在互联网业务中被广泛用来进行互联网搜索、推荐和广告的点击预估，可以说是使用频次最多的机器学习模型，也是深度神经网络的基础。在一些机器学习新人面试中，面试官经常会考察Logistic Regression的基本公式、损失函数的推导等问题。

{% katexmm %}

## 从回归到分类

回归问题是指目标值为整个实数域，分类问题是指目标值为有限的离散值。

前面几篇文章系统讨论了线性回归模型：
$$
f(\boldsymbol{x_i}) = \sum^n_{j=0} w_j x_{i,j} = \boldsymbol{w}^\top \boldsymbol{x_i}
$$
这是一个回归模型，模型可以预测$(-\infty, +\infty)$范围的目标值。在模型求解时，我们可以使用误差平方定义损失函数，最小化损失函数即可求得模型参数。

现在，我们想进行二元分类，目标值有0和1两个选项，一个二分类函数可以表示为：
$$
y = 
\begin{cases}
   0 &\text{if } z < 0 \\
   1 &\text{if } z \geq 0
\end{cases}
$$
当$z<0$时，将分类目标判定为负例，当$z\geq0$时将分类目标判定为正例。这个分类函数其实是一个阶跃函数，在$z=0$不连续，或者说在$z=0$处发生了跳跃，这样的函数不方便求导。我们需要使用其他单调可微的函数来替代这个二元分类函数。

现在，我们可以在这个线性回归的基础上，在其外层套上一个函数$g(z)$。一个最常见的函数为：
$$
g(z)= \frac 1 {1+e^{-z}}
$$
这个函数的形状如下所示，它被称为对数几率函数、Logistic函数或者Sigmoid函数，后文将称之为Logistic函数。

![Logistic Function](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-05-29-135914.png)

从图形可以看出，Logistic函数有一些性质：

* 函数定义域为$(-\infty, +\infty)$，值域为$(0, 1)$。
* 当$z$趋近于$-\infty$时，$g(z)$趋近于$0$；当$z$趋近于$+\infty$时，$g(z)$趋近于$1$；当$z$取$0$时，$g(z)$等于$0.5$。
* 整个函数呈S形。
* 函数单调可微。

严格来说，Sigmoid函数是一个庞大的函数家族，用来表示S形函数。我们现在讨论的Logistic函数是Sigmoid函数中的一种，也是最具代表性的一个。Sigmoid函数将在神经网络中起重要作用。

Logistic函数的这些性质决定了它可以将$(-\infty, +\infty)$映射到$(0, 1)$上，加上它在中心点处取值为$0.5$，可以用来进行分类。因为Logistic函数有明确的分界线，$z$小于0的部分将被分为负例（0），$z$大于0的部分将被分为正例（1）。

我们将线性回归套入Logistic函数，可以得到：
$$
y = f(x) = g(w^\top x) = \frac 1{1+e^{-w^{\top}x}}
$$
我们在线性回归的基础上增加了一个Logistic函数，于是可以进行二元分类预测。一个训练集中有$m$条数据，第$i$条数据按照下面的公式进行拟合：
$$
y_i = f(\boldsymbol{x_i}) = g(\boldsymbol{w}^\top \boldsymbol{x_i}) = \frac 1{1+e^{-\boldsymbol{w}^{\top}\boldsymbol{x_i}}}
$$
这就是Logistic回归、逻辑斯蒂回归（Logistic Regression）。模型训练好后，一般设置一个阈值，小于阈值的被判定为负例，大于阈值的被判定为正例。

{: .tip}
Logistic Regression中虽然名称中带有Regression回归字样，实际上，这是一个著名的分类模型。

## Logistic函数二元概率解释

Logistic函数适合表示二分类概率。假设我们将$y$表示为分类时作为正例的可能性，那么$1-y$就是分成负例的可能性。恰好Logistic Regression有如下性质：
$$
\ln \frac{y}{1-y}=w^\top x
$$

其中，$\frac{y}{1-y}$被称为几率（Odds），表示当前数据被分类到正例的相对可能性。$\ln \frac{y}{1-y}$是几率的对数，被称为对数几率（Log Odds，或者Logit）。

我们回顾一下概率知识：我们知道概率都是$[0, 1]$区间上的值，假设一件事物成功的概率为$P(Success)=0.8$，失败的概率为$P(Fail) = 1-P(Success)=0.2$。那么，这件事成功的几率Odds为：$\frac{P(Success)}{1-P(Success)}=\frac{0.8}{0.2}=4$。也就是说，它成功的可能性非常大。

回到Logistic Regression上，线性回归$w^\top x$试图去逼近几率的对数$\ln \frac{y}{1-y}$。实际上，Logitstic Regression对分类的可能性进行建模，可以得到近似概率的预测。很多基于概率辅助决策的任务都会使用此模型。比如，包括Google在内的很多公司曾经使用Logistic Regression预测一条互联网广告是否会被点击，预测值越高，越会投放在醒目的位置，吸引用户点击。

Logistic函数将$(-\infty, +\infty)$映射到了$(0, 1)$上，无论多大或者多小的值，都可以和一个$(0, 1)$区间的概率联系起来，这样就得到了一个概率分布。

## Logistic Regression的最大似然估计

Logistic函数可以和概率联系起来，于是我们可以将$y$视为分类到正例的概率估计：$P(y=1|\boldsymbol{x})$，分类到负例的概率为：$P(y=0|\boldsymbol{x})$。
$$
P(y=1|\boldsymbol{x}) = f(\boldsymbol{x})
$$

$$
P(y=0|\boldsymbol{x})=1-f(\boldsymbol{x})
$$

可以将上面这两个概率写成一个更为紧凑的公式：		

$$
P(Y=y | \boldsymbol{x};\boldsymbol{w}) =(f (\boldsymbol{x}))^y(1- f (\boldsymbol{x}))^{1-y}
$$
由于$y$只有两种可能，即0（负例）和1（正例）：那么如果$y=1$，$(1- f (\boldsymbol{x}))^0=1$，$P(Y=y | \boldsymbol{x})=(f(\boldsymbol{x}))^1$，如果$y=0$，$(f (\boldsymbol{x}))^0=1$，$P(Y=y | \boldsymbol{x})=(1-f(\boldsymbol{x}))^1$。上式中，分号和$\boldsymbol{w}$表示，$\boldsymbol{w}$是参数，并不是随机变量。

有了概率表示，我们很容易进行概率上的最大似然估计。因为似然函数与概率函数的形式几乎相似，概率函数就是所有样本发生的概率的乘积，而似然函数是关于参数$\boldsymbol{w}$的函数。
$$
\begin{aligned}
L(\boldsymbol{w}) &= P(\boldsymbol{y}| \boldsymbol{X}; \boldsymbol{w})\\
&= \prod^m_{i=1}  P(y_{i}| \boldsymbol{x_{i}}; \boldsymbol{w})\\
&= \prod^m_{i=1} (f (\boldsymbol{x_{i}}))^{y_{i}}(1- f (\boldsymbol{x_{i}}))^{1-y_{i}} \\
\end{aligned}
$$
和线性回归一样，我们对上面的公式取$\log$，这样更容易实现似然函数的最大化：

$$
\begin{aligned}
\ell(\boldsymbol{w}) &=\log L(\boldsymbol{w}) \\
&= \sum^m_{i=1} y_{i} \log f(\boldsymbol{x_{i}})+(1-y_{i})\log (1-f(\boldsymbol{x_{i}}))
\end{aligned}
$$
如何求得上面公式的解？和线性回归一样，我们可以利用梯度上升法。当前目标是最大化似然函数，因此我们要使用梯度上升，不断迭代寻找最大值。具体而言，参数按照下面的方式来更新：
$$
 \boldsymbol{w} := \boldsymbol{w} +\alpha \nabla _\boldsymbol{w} \ell(\boldsymbol{w})
$$
参数估计中最关键的是得到导数公式。求导之前，我们再回顾一下Logistic Regression：
$$
f(\boldsymbol{x}) = g(\boldsymbol{w}^\top \boldsymbol{x})
$$

$$
g(z)= \frac 1 {1+e^{-z}}
$$

而Logistic函数$g(z)$在求导时有：$g'(z) = g(z)(1-g(z))$，因为：
$$
\begin{aligned}
g'(z) & = \frac d{dz}\frac 1{1+e^{-z}}\\
& = \frac  1{(1+e^{-z})^2}(e^{-z})\\
& = \frac  1{(1+e^{-z})} \cdot (1- \frac 1{(1+e^{-z})})\\
& = g(z)(1-g(z))\\
\end{aligned}
$$
然后，我们开始求参数的导数。我们仍然先假设训练集中只有一条数据$(\boldsymbol{x}, y)$。下面推导的第三行就用到了Logistic函数导数性质$g'(z) = g(z)(1-g(z))$。
$$
\begin{aligned}
\frac  {\partial}{\partial w_j} \ell(\boldsymbol{w}) &= (y\frac  1 {f(\boldsymbol{x})}  - (1-y)\frac  1 {1 - f(\boldsymbol{x})})\frac  {\partial}{\partial w_j}f(\boldsymbol{x}) \\
&= (y\frac  1 {g(\boldsymbol{w} ^\top \boldsymbol{x})}  - (1-y)\frac  1 {1- g(\boldsymbol{w}^\top \boldsymbol{x})}   )\frac  {\partial}{\partial w_j}g(\boldsymbol{w} ^\top \boldsymbol{x}) \\
&= (y\frac  1 {g(\boldsymbol{w}^\top \boldsymbol{x})}  - (1-y)\frac  1 {1- g(\boldsymbol{w}^\top \boldsymbol{x})})  g(\boldsymbol{w}^\top \boldsymbol{x})(1-g(\boldsymbol{w}^\top \boldsymbol{x})) \frac  {\partial}{\partial w_j}\boldsymbol{w}^\top \boldsymbol{x} \\
&= (y(1-g(\boldsymbol{w}^\top \boldsymbol{x}) ) -(1-y) g(\boldsymbol{w}^\top \boldsymbol{x})) x_j\\
&= (y-g(\boldsymbol{w}^\top \boldsymbol{x}))x_j \\
&= (y-f(\boldsymbol{x}))x_j
\end{aligned}
$$

那么，具体到参数迭代更新的公式上，以训练集的第$i$条样本数据拿来进行计算：
$$
w_j := w_j + \alpha (y_{i}-f(\boldsymbol{x_{i}}))x_{i,j}
$$
跟我们之前推导的线性回归函数的公式可以说是一模一样。于是，在这个问题上，我们可以使用梯度上升法来获得最优解。或者做个简单的变换，变成梯度下降法：
$$
w_j := w_j - \alpha (f(\boldsymbol{x_{i}})-y_{i})x_{i,j}
$$
前面公式只是假设训练集中只有一条样本数据，而当训练集有$m$条数据，对$\ell(\boldsymbol{w}) = \sum^m_{i=1} y_{i} \log f(\boldsymbol{x_{i}})+(1-y_{i})\log (1-f(\boldsymbol{x_{i}}))$进行求导，实际上是可以得到：
$$
\frac  {\partial}{\partial w_j} \ell(\boldsymbol{w}) = \sum_{i=1}^m(y_i - f(\boldsymbol{x_i}))\boldsymbol{x_{i,j}}
$$
直接拿全量数据来更新参数不太现实，绝大多数情况下都会使用随机梯度下降法求解，可以随机挑选某个样本来更新参数，也可以随机挑选一小批Mini-batch样本来更新参数。

{% endkatexmm %}


**参考资料**

1. Andrew Ng：CS229 Lecture Notes
2. 周志华: 机器学习
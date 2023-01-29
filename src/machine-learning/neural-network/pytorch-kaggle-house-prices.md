---
title: 神经网络房价预测-PyTorch实现
order: 4
head:
  - - meta
    - name: keywords
      content: 神经网络, 深度学习, PyTorch, 房价预测, Kaggle
description: "使用PyTorch构建神经网络，进行房价预测。"
category: [机器学习]
tag: [房价预测]
article: false
---

本文将学习一下如何使用PyTorch创建一个前馈神经网络（或者叫做多层感知机，Multiple-Layer Perceptron，MLP），文中会使用PyTorch提供的自动求导功能，训练一个神经网络。

本文的数据集来自Kaggle竞赛：[房价预测](https://www.kaggle.com/c/house-prices-advanced-regression-techniques/)。这份数据分为训练数据集和测试数据集。两个数据集都包括每栋房子的特征，如建造年份、地下室状况等特征值。这些特征中，有连续的数值型（Numerical）特征，有离散的分类（Categorical）特征。这些特征中，有些特征值是缺失值“na”。训练数据集包括了每栋房子的价格，也就是需要预测的目标值（Label）。我们应该用训练数据集训练一个模型，并对测试数据集进行预测，然后将结果提交到Kaggle。

## 数据探索和预处理

首先，我们下载并加载数据集：

```python
train_data_path ='./dataset/train.csv'
train = pd.read_csv(train_data_path)

num_of_train_data = train.shape[0]

test_data_path ='./dataset/test.csv'
test = pd.read_csv(test_data_path)
```

训练数据集共1460个样本，81个维度，其中，`Id`是每个样本的唯一编号，`SalePrice`是房价，也是我们要拟合的目标值。其他维度（列）有数值类特征，也有非数值列，或者叫分类特征。

先查看训练数据集的维度：

```python
train.shape
```

输出为：

```
(1460, 81)
```

或者通过`train.describe()`来查看整个数据集各个特征的一些统计情况。

接着，我们要把训练数据集和测试数据集合并。将训练数据集和测试数据集合并主要是为了统一特征处理的流程，或者说对训练数据集和测试数据集使用同样的方法，进行同样的特征工程处理。

```python
# 房价，要拟合的目标值
target = train.SalePrice

# 输入特征，可以将SalePrice列扔掉
train.drop(['SalePrice'],axis = 1 , inplace = True)

# 将train和test合并到一起，一块进行特征工程，方便预测test的房价
combined = train.append(test)
combined.reset_index(inplace=True)
combined.drop(['index', 'Id'], inplace=True, axis=1)
```

接着就要开始进行特征工程了。本文没有进行任何复杂的特征工程，只做了两件事：1、过滤掉了含有缺失值的列；2、对分类特征进行了One-Hot编码。缺失值会在一定程度上影响算法的预测效果，一般可以使用一些默认值或者一些临近值来填充缺失值。对于MLP模型，分类特征必须经过编码，转换成数值才能进行模型训练，One-Hot编码是一种最常见的分类特征处理的方法。

我们用下面的函数过滤非空列：

```python
# 选出非空列
def get_cols_with_no_nans(df,col_type):
    '''
    Arguments :
    df : The dataframe to process
    col_type : 
          num : to only get numerical columns with no nans
          no_num : to only get nun-numerical columns with no nans
          all : to get any columns with no nans    
    '''
    if (col_type == 'num'):
        predictors = df.select_dtypes(exclude=['object'])
    elif (col_type == 'no_num'):
        predictors = df.select_dtypes(include=['object'])
    elif (col_type == 'all'):
        predictors = df
    else :
        print('Error : choose a type (num, no_num, all)')
        return 0
    cols_with_no_nans = []
    for col in predictors.columns:
        if not df[col].isnull().any():
            cols_with_no_nans.append(col)
    return cols_with_no_nans
```

分别对数值特征和分类特征进行处理：

```python
num_cols = get_cols_with_no_nans(combined, 'num')
cat_cols = get_cols_with_no_nans(combined, 'no_num')

# 过滤掉含有缺失值的特征
combined = combined[num_cols + cat_cols]

print(num_cols[:5])
print ('Number of numerical columns with no nan values: ',len(num_cols))
print(cat_cols[:5])
print ('Number of non-numerical columns with no nan values: ',len(cat_cols))
```

经过过滤，数值特征共有25列，分类特征共有20列，共45列。

```python
# 对分类特征进行One-Hot编码
def oneHotEncode(df,colNames):
    for col in colNames:
        if( df[col].dtype == np.dtype('object')):
            # pandas.get_dummies 可以对分类特征进行One-Hot编码
            dummies = pd.get_dummies(df[col],prefix=col)
            df = pd.concat([df,dummies],axis=1)

            # drop the encoded column
            df.drop([col],axis = 1 , inplace=True)
    return df
```

对于分类特征，还需要进行One-Hot编码，`pandas.get_dummies`可以帮我们自动完成One-Hot编码过程。经过One-Hot编码后，数据增加了很多列，共有149列。

至此，我们完成了一次非常简单的特征工程，将这些数据转化为PyTorch模型所能接受的Tensor形式：

```python
# 训练数据集特征
train_features = torch.tensor(combined[:num_of_train_data].values, dtype=torch.float)
# 训练数据集目标
train_labels = torch.tensor(target.values, dtype=torch.float).view(-1, 1)
# 测试数据集特征
test_features = torch.tensor(combined[num_of_train_data:].values, dtype=torch.float)

print("train data size: ", train_features.shape)
print("label data size: ", train_labels.shape)
print("test data size: ", test_features.shape)
```

## 构建神经网络

接着，我们开始构建神经网络。

在PyTorch中构建神经网络有两种方式。比较简单的前馈网络，可以使用`nn.Sequential`。`nn.Sequential`是一个存放神经网络的容器，直接在`nn.Sequential`里面添加我们需要的层即可。整个模型的输入为特征数，输出为一个标量。模型的隐藏层使用了ReLU激活函数，最后一层是一个线性层，得到的是一个预测的房价值。

```python
model_sequential = nn.Sequential(
          nn.Linear(train_features.shape[1], 128),
          nn.ReLU(),
          nn.Linear(128, 256),
          nn.ReLU(),
          nn.Linear(256, 256),
          nn.ReLU(),
          nn.Linear(256, 256),
          nn.ReLU(),
          nn.Linear(256, 1)
        )
```

另一种构建神经网络的方式是继承`nn.Module`类，我们将子类起名为`Net`类。`__init__()`方法为`Net`类的构造函数，用来初始化神经网络各层的参数；`forward()`也是我们必须实现的方法，主要用来实现神经网络的前向传播过程。

```python
class Net(nn.Module):
  
    def __init__(self, features):
        super(Net, self).__init__()
        
        self.linear_relu1 = nn.Linear(features, 128)
        self.linear_relu2 = nn.Linear(128, 256)
        self.linear_relu3 = nn.Linear(256, 256)
        self.linear_relu4 = nn.Linear(256, 256)
        self.linear5 = nn.Linear(256, 1)
        
    def forward(self, x):
        
        y_pred = self.linear_relu1(x)
        y_pred = nn.functional.relu(y_pred)

        y_pred = self.linear_relu2(y_pred)
        y_pred = nn.functional.relu(y_pred)

        y_pred = self.linear_relu3(y_pred)
        y_pred = nn.functional.relu(y_pred)

        y_pred = self.linear_relu4(y_pred)
        y_pred = nn.functional.relu(y_pred)

        y_pred = self.linear5(y_pred)
        return y_pred
```

我们已经定义好了一个神经网络的`Net`类，还要初始化一个`Net`类的对象实例`model`，表示某个具体的模型。然后定义损失函数，这里使用`MSELoss`，`MSELoss`使用了均方误差（Mean Square Error）来衡量损失函数。对于模型`model`的训练过程，这里使用Adam算法。Adam是优化算法中的一种，在很多场景中效率要优于SGD。

```python
model = Net(features=train_features.shape[1])

# 使用均方误差作为损失函数
criterion = nn.MSELoss(reduction='mean')

optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
```

## 训练模型

接着，我们使用Adam算法进行多轮的迭代，更新模型`model`中的参数。这里对模型进行500轮的迭代。

```python
losses = []

# 训练500轮
for t in range(500):
    y_pred = model(train_features)
    
    loss = criterion(y_pred, train_labels)
    # print(t, loss.item())
    losses.append(loss.item())
    
    if torch.isnan(loss):
        break
    
    # 将模型中各参数的梯度清零。
    # PyTorch的backward()方法计算梯度会默认将本次计算的梯度与缓存中已有的梯度加和。
    # 必须在反向传播前先清零。
    optimizer.zero_grad()
    
    # 反向传播，计算各参数对于损失loss的梯度
    loss.backward()
    
    # 根据刚刚反向传播得到的梯度更新模型参数
    optimizer.step()
```

每次迭代使用训练数据集中的所有样本`train_features`。`model(train_features)`实际是执行的`model.forward(train_features)`，即`forward()`方法中定义的前向传播逻辑，输入数据在神经网络模型中前向传播，得到预测值`y_pred`。`criterion(y_pred, train_labels)`方法计算了预测值`y_pred`和目标值`train_labels`之间的损失。

每次迭代时，我们要先对模型中各参数的梯度清零：`optimizer.zero_grad()`。PyTorch中的`backward()`默认是把本次计算的梯度和缓存中已有的梯度加和，因此必须在反向传播前先将梯度清零。接着执行`backward()`方法，完成反向传播过程，PyTorch会帮我们计算各参数对于损失函数的梯度。`optimizer.step()`会根据刚刚反向传播得到的梯度，更新模型参数。

至此，一个简单的预测房价的模型就训练好了。

## 测试模型

我们可以使用模型对测试数据集进行预测，将得到的预测值保存成文件，提交到Kaggle上。

```python
predictions = model(test_features).detach().numpy()
my_submission = pd.DataFrame({'Id':pd.read_csv('./dataset/test.csv').Id,'SalePrice': predictions[:, 0]})
my_submission.to_csv('{}.csv'.format('./dataset/submission'), index=False)
```

**参考资料**

1. [https://tangshusen.me/Dive-into-DL-PyTorch/#/chapter03_DL-basics/3.16_kaggle-house-price](https://tangshusen.me/Dive-into-DL-PyTorch/#/chapter03_DL-basics/3.16_kaggle-house-price)
---
title: __call__ 方法
head:
  - - meta
    - name: keywords
      content: __call__, 内置方法, python
description: "Python __call__"
order: 2
category: [Python]
article: false
---

`__call__` 方法主要提供的功能是让一个对象实例还能够像函数一样调用。

```python
class Test():
    def __init__(self):
        pass
    
    def __call__(self, a):
        print(f"Invoking '__call__' method with parameters: {a}")
```

调用时，我们跟其他方法一样，生成一个 `Test` 类的对象实例 `test`，这个 `test` 还能像函数一样被调用：

```python
>>> test = Test()
>>> test(a="hello")
Invoking '__call__' method with parameters: hello
```

另外一种实现：将任意一个 `Callable` 赋值给 `__call__`，由于 `Callable` 本身就是一个函数，因此 `__call__` 执行的就是这个函数。

```python
class Test():
    def __init__(self):
        pass
    
    def run(self):
        print("Invoking '__call__' method")
    
    __call__ = run
```

著名深度学习框架 PyTorch 的 `nn.Module` 就大量使用了 `__call__`。比如，我们经常定义一个神经网络，并进行前向传播：

```python
class Net(nn.Module):
    ...

# model 是一个 nn.Module 实例
model = Net(...)

# model 内部调用 __call__ 方法进行前向传播
y_pred = model(train_features)
```

在 PyTorch `nn.Module` 的[源代码](https://github.com/pytorch/pytorch/blob/HEAD/torch/nn/modules/module.py)是这么实现的：

```python
class Module:
    ...

    def _wrapped_call_impl(self, *args, **kwargs):
        if self._compiled_call_impl is not None:
            return self._compiled_call_impl(*args, **kwargs)  # type: ignore[misc]
        else:
            return self._call_impl(*args, **kwargs)
    
    __call__ : Callable[..., Any] = _wrapped_call_impl
```
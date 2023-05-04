---
title: 编写 asyncio 代码
head:
  - - meta
    - name: keywords
      content: 异步IO, asyncio, python
description: "使用 asyncio 进行Python异步编程"
order: 2
category: [Python]
article: false
---

[上一节](basics.md)我们介绍了协程调用相关基础概念。这一节开始使用 asyncio 进行异步编程。

## async def 关键字

`async def` 是 asyncio 异步编程中最关键的关键字，它用来声明一个异步协程函数，就像用 `def` 定义一个普通的同步函数一样。

::: info 可以认为 async def 共同组成一个关键字

可以认为 `async def` 共同组成一个关键字。实际上， `async` 本身是一个关键字，但我们并不能单独使用 `async` 。所以，可以简单认为 `async def` 组合在一起，共同组成一个关键字。同样， `async for` 和 `async with` 也是两个单词共同组成的关键字。

:::

下面的例子中我们定义了一个协程函数 `example_coroutine_function` 和一个普通函数 `example_function`。 `example_function` 的代码块是普通的同步 Python 代码，而`example_coroutine_function` 的代码块是异步 Python 代码，又被称为协程。

```python {1,5}
async def example_coroutine_function(a, b):
    # 异步代码
    ...

def example_function(a, b):
    # 同步代码
    ...
```

::: tip 

* 我们**只**能在 `async def` 定义的协程函数体内编写异步 Python 代码。
* 异步 Python 代码可以使用普通 Python 中允许的任何 Python 关键字、结构等。
* 有几个只能在异步代码中使用的新关键字：await、async with 和 async for。

:::

使用 `async def` 定义一个协程函数，这看起来与使用 `def` 的普通函数声明非常相似。大多数时候确实非常相似，但是有一些关键的区别，这对于异步编程非常重要：

1. `def` 定义一个同步函数，函数本身是一个 `Callable` 对象，调用这个函数的时候，函数体内的代码被执行。

```python
def example_function(a, b, c):
    ...
```

`example_function` 是一个 `Callable` 对象，这个函数接收3个参数，像这样调用它：

```python
r = example_function(1, 2, 3)
```

调用之后，`example_function` 会被立即执行，返回值会被赋值给 `r` 。

2. `async def` 关键字也定义了一个 `Callable` 对象，但当我们调用这个函数时，函数体内代码**不是**立即执行。

```python
async def example_coroutine_function(a, b, c):
    ...
```

跟 `example_function` 类似，`example_coroutine_function` 也是一个 `Callable` 对象，它接受3个参数，通过下面的方式调用：

```python
r = example_coroutine_function(1, 2, 3)
```

但这不会直接运行函数体内的代码块。相反，Python 创建了一个 `Coroutine` 对象，并将其分配给 `r`。要使代码块实际运行，您需要使用 asyncio 提供的其他工具。最常见的是 `await` 关键字。下面的示例中使用了函数 asyncio.gather。其他示例可以在 python 文档中找到。参见例如等待。

:::



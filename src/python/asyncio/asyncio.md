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
* 有几个只能在异步代码中使用的新关键字：`await`、`async with` 和 `async for`。

:::

使用 `async def` 定义一个协程函数，这看起来与使用 `def` 的普通函数声明非常相似。大多数时候确实非常相似，但是有一些关键的区别，这对于异步编程非常重要：

1. `def` 定义一个同步函数，函数本身是一个 `Callable` 对象，调用这个函数的时候，函数体内的代码被执行。

```python
def example_function(a, b, c):
    ...
```

`example_function` 是一个 `Callable` 对象实例，这个函数接收3个参数，像这样调用它：

```python
r = example_function(1, 2, 3)
```

调用之后，`example_function` 会被立即执行，返回值会被赋值给 `r` 。

2. `async def` 关键字也定义了一个 `Callable` 对象实例，但当我们调用这个函数时，函数体内代码**不是**立即执行。

```python
async def example_coroutine_function(a, b, c):
    ...
```

跟 `example_function` 类似，`example_coroutine_function` 也是一个 `Callable` 对象实例，它接受3个参数，通过下面的方式调用：

```python
r = example_coroutine_function(1, 2, 3)
```

但执行这行之后**不会**直接运行函数体内的代码块。相反，Python 创建了一个 `Coroutine` 对象实例，并将其分配给 `r`。要使代码块实际运行，需要使用 asyncio 提供的其他工具。最常见的是 `await` 关键字。接下来我们开始讨论 `await`。

## await 与 awaitable

`await` 是 asyncio 的最为核心的关键字之一。

* 它只能在异步代码块中使用，即在 `async def` 语句定义的协程代码块中。
* 它有一个参数，并且有一个返回值。

例如：

```python
r = example_coroutine_function(1, 2, 3)
s = await r
```

上面这行代码中，`r` 是一个 awaitable 对象。它用 `r = example_coroutine_function(1, 2, 3)` 定义。 执行 `s = await r` 这行代码，就将对 `r` 执行 `await` 操作并将返回值赋值给 `s`。

awaitable 对象，从名字中可以看出，这种对象是可以被等待的。

将刚才例子的两行整合成一行：

```python
s = await example_coroutine_function(1, 2, 3)
```

一个 `async def` + `await` 的完整的例子：

```python
import asyncio

async def add(x, y):
    return x + y

async def get_results():
    # 直接 print(add(3, 4)) 得到的是一个 coroutine object
    # 这个 coroutine object 是 awaitable 的
    # 而且还会提示：RuntimeWarning: coroutine 'add' was never awaited
    # 因为这个 awaitable 从来没被 await
    print(add(3, 4))

    # 打印出结果为 7
    print(await add(3, 4))

    res1 = await add(3, 4)
    res2 = await add(8, 5)
    # 打印出结果为 7 13
    print(res1, res2)

asyncio.run(get_results())
```

可以看到 `await` 在 `async def` 定义的协程 `get_results()` 里。直接 `print(add(3, 4))` 得到的是一个 Coroutine 对象，这个 coroutine 对象是 awaitable 可等待的。而且还会提示：RuntimeWarning: coroutine 'add' was never awaited，因为这个 awaitable 对象从来没被 await。 `print(await add(3, 4))` 可以打印出结果，先 `await` ，才能得到结果。

换个角度思考，`await` 一个 coroutine object，有点像主动去调用一个传统意义上的同步函数。这个 coroutine 对象里的代码段包含了异步的代码。回忆[上一节](basics.md)，我们提到，异步代码是以 Task 的形式去运行，被 Event Loop 管理和调度的，Task 可以被暂停和恢复，每个 Task 有自己调用栈。所以，虽然调用一个同步函数和 `await` 一个 coroutine 对象有点像，但是 coroutine 对象中的异步代码是可以被暂停和恢复的。这也是同步函数和异步函数的重要区别。

一共有三种可以被 `await` 的对象：

* coroutine 对象

前面多个例子中的 `await r`， `r` 是一个 coroutine 对象。

* `asyncio.Future` 类对象

如果 `await` 一个 `asyncio.Future` 对象，则当前 Task 被暂停。下文提到的 `asyncio.Task` 是一种继承了 `asyncio.Future` 的类。或者说，`asyncio.Future` 是提供了底层的 awaitable 接口。下文用 `Task` 指代 `asyncio.Task`，用 `Future` 指代 `asyncio.Future`。

* 实现了 `__await__` 方法的类和对象

这种方法给一些包开发者提供了接口，开发者可以自己定义一些 awaitable 的类。

## 运行一个协程

刚才提到，`async def` 定义一个协程，协程跟普通函数区别是不会直接运行，如果想运行这个协程，可以：

* `asyncio.run`。

用 `asyncio.run` 作为整个异步函数的入口。比如:

```python
async def main():
    print("hello")

asyncio.run(main())
```

* `await` coroutine 对象。

之前提到的类似的例子：

```python
async def hello():
    return "hello"

async def main():
    coro = hello()
    h = await coro
    print(h)
```

* `asyncio.create_task()`，创建一个 `Task` 对象实例，`Task` 对象实例立即被运行。

```python
async def hello():
    print("async function called")
    return "hello"

async def main():
    t = asyncio.create_task(hello())
    h = await(t)
    print(h)
```

这里的三个场景，第二种 `await` 的方式和第三种 `asyncio.create_task()` 看不出明显区别。我们需要加一个 `asyncio.sleep()` 可能才能看出一些区别。

## asyncio.sleep()

`asyncio.sleep()` 和 `time.sleep()` 很像。`asyncio.sleep()` 是 `asyncio` 库专用的，它跟其他协程函数一样，是**异步**的，或者说是**非阻塞**的。与之对应，`time.sleep()` 是**同步**的，或者说是**阻塞**的。

当 `time.sleep()` 被调用，整个程序都会暂停，什么都做不了。

当 `await asyncio.sleep()` 被调用，如果使用了 Event Loop，Event Loop 会将当前的 `asyncio.sleep()` 的协程暂停，Event Loop 去找其他可以被唤醒的 `Task`，先执行其他 `Task` 。当刚刚这个 `asyncio.sleep()` 满足了睡眠时间，Event Loop 把这个协程唤醒。

但在协程的场景，确实不容易理解这两种不同的 `sleep` 到底发生有什么区别。

下面用几个例子来演示 `asyncio.sleep()` 。

### time.sleep()

```python {6}
import asyncio
import time

async def call_api():
    print('Hello')
    time.sleep(3)
    print('World')

async def main():
    start = time.perf_counter()
    await asyncio.gather(call_api(), call_api())
    end = time.perf_counter()
    print(f'It took {end-start} second(s) to complete.')

asyncio.run(main())
```

得到的结果是：

```
Hello
World
Hello
World
It took 6.006464317906648 second(s) to complete.
```

如果使用 `time.sleep()` ：先打印 Hello，等待3秒，再打印 World。一共执行了两次 `call_api()` ，两次 `call_api()` 都是相互阻塞，执行一共需要6秒多。

`call_api()` 内部经历了下面的过程：

* `print()`
* 休眠几秒
* 继续执行 `return result`

用图去演示这个过程：

![阻塞调用](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-05-28-asyncio-sleep.svg)

### asyncio.sleep()

如果使用 `asyncio.sleep()`：

```python {6}
import asyncio
import time

async def call_api():
    print('Hello')
    await asyncio.sleep(3)
    print('World')

async def main():
    start = time.perf_counter()
    await asyncio.gather(call_api(), call_api())
    end = time.perf_counter()
    print(f'It took {end-start} second(s) to complete.')

asyncio.run(main())
```

输出结果：

```
Hello
Hello
World
World
It took 3.003517189063132 second(s) to complete.
```

改成 `asyncio.sleep()` 后：两次的 Hello 被马上打印出来，说明 `asyncio.sleep()` 没有阻塞程序执行，而是让多个协程并发执行，整个程序的总时间也仅用了3秒多。

两次 `call_api()` 和 `main` 内部经历了下面的过程：

* 第一个 `call_api()` 调用 `print()`
* 第一个进入休眠状态，Event Loop 唤醒第二个 `call_api()`

用图去演示这个过程：

![非阻塞调用](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-05-28-task-concurrency.svg)

在这里用了 `asyncio.gather()` 的API，它可以并发地运行协程，或者说它可以将协程调度为 Task。下面重点说说如何让协程调度为 Task。 

## Task

### 没有使用 Event Loop

```python
import asyncio
import time

async def call_api():
    print("Hello")
    await asyncio.sleep(3)
    print("World")

async def main():
    start = time.perf_counter()

    await call_api()
    await call_api()

    end = time.perf_counter()
    print(f'It took {end-start} second(s) to complete.')

asyncio.run(main())
```

输出结果：

```
Hello
World
Hello
World
It took 6.005615991074592 second(s) to complete.
```

在这个例子中，直接创建了协程并通过 `await` 来等待协程执行结果，结果显示这个程序和普通的同步函数没有任何区别。主要原因是：这里其实没有将协程放到 Event Loop 中。或者说，虽然这里使用了 `async def` 和 `await` 关键字编写了异步的代码，但是依然像同步函数那样执行。

### Task 与 Event Loop

[上一节](basics.md)我们重点介绍异步程序与同步程序的区别在于：程序以 `Task` 的形式放到 Event Loop 中，Event Loop 管理多个 `Task`，唤醒某个 `Task` 或者暂停某个 `Task` 。

如何创建一个 `Task`，并将这个 `Task` 放到 Event Loop ？答案是用 `asyncio.create_task()` 。`asyncio.create_task()` 是一个比较直观的 API，其他的还有 `asyncio.gather()` 等。

把刚才的程序做一个简单的修改，`call_api()` 不变，只不过调用 `call_api()` 的方式变为使用 `asyncio.create_task()`。

```python {12-14,19}
import asyncio
import time

async def call_api():
    print("Hello")
    await asyncio.sleep(3)
    print("World")

async def main():
    start = time.perf_counter()

    task_1 = asyncio.create_task(
        call_api()
    )
    task_2 = asyncio.create_task(
        call_api()
    )
    hello1 = await task_1
    world2 = await task_2

    end = time.perf_counter()
    print(f'It took {end-start} second(s) to complete.')

asyncio.run(main())
```

输出结果为：

```
Hello
Hello
World
World
It took 3.0035055382177234 second(s) to complete.
```

两次 Hello 几乎同时被打印出来，说明 `call_api()` 非阻塞执行。

在这个程序中，两个关键点：

* `task = asyncio.create_task()` 创建协程

`asyncio.create_task()` 将协程函数创建为 `Task`，函数的返回值是一个 `Task` 对象，所创建的 `Task` 被放到了 Event Loop 中。

* `await task` 等待 `Task` 执行结束

如果不 `await task`，我们只看到了开头的 Hello，看不到结尾的 World。程序还没执行完，就退出了。

这里本质上是等待 `Task` 的 `done()` 方法返回 `True`。返回 `True` 说明 `Task` 执行结束。使用 `done()` 来判断 `Task` 是否结束的程序：

```python {19-29}
import asyncio
import time

async def call_api():
    print("Hello")
    await asyncio.sleep(3)
    print("World")

async def main():
    start = time.perf_counter()

    task_1 = asyncio.create_task(
        call_api()
    )
    task_2 = asyncio.create_task(
        call_api()
    )

    tasks = [task_1, task_2]
    while True:
        # 检查所有 tasks 中哪些还没结束
        tasks = [t for t in tasks if not t.done()]
        if len(tasks) == 0:
            # 所有 tasks 都结束，tasks 数组为空，程序可以结束
            end = time.perf_counter()
            print(f'It took {end-start} second(s) to complete.')
            return
        # tasks 中有还没结束的 Task，使用 await 等待
        await tasks[0]

asyncio.run(main())
```

** 参考资料 **

* [https://bbc.github.io/cloudfit-public-docs/asyncio/asyncio-part-2.html](https://bbc.github.io/cloudfit-public-docs/asyncio/asyncio-part-2.html)
* [https://www.pythontutorial.net/python-concurrency/python-asyncio-create_task/](https://www.pythontutorial.net/python-concurrency/python-asyncio-create_task/)
* [https://docs.python.org/3/library/asyncio-task.html](https://docs.python.org/3/library/asyncio-task.html)
* [https://stackoverflow.com/questions/56729764/asyncio-sleep-vs-time-sleep](https://stackoverflow.com/questions/56729764/asyncio-sleep-vs-time-sleep)





---
title: classmethod 装饰器
head:
  - - meta
    - name: keywords
      content: classmethod, 装饰器, python
description: "Python @classmethod"
order: 1
category: [Python]
article: false
---

`@classmethod` 装饰器用在一个类名为 `ClassName` 下的 `methodname()` 函数上，可以使用 `ClassName.methodname()` 的方式调用这个方法。也可以使用类的对象调用这个方法。

```python
class ClassName:

    @classmethod
    def methodname(cls, arg1, arg2):
        ...

# 用类名调用这个方法
ClassName.methodname(arg1, arg2)

# 或者用实例调用这个方法
instance = ClassName()
instance.methodname(arg1, arg2)
```

`@classmethod` 本质是 `classmethod()` 函数。用 `@classmethod` 装饰器装饰到函数头上，写起来更简洁，是一种典型的语法糖。


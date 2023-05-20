---
title: staticmethod
head:
  - - meta
    - name: keywords
      content: staticmethod, 装饰器, python
description: "Python @staticmethod"
order: 2
category: [Python]
article: false
---

## 基本功能案例

`@staticmethod` 是 Python 自带的装饰器之一，它用在一个类名为 `ClassName` 下的 `methodname()` 函数上，装饰之后就可以使用 `ClassName.methodname()` 的方式调用这个 `methodname()` 方法，还可以使用类的对象实例调用这个 `methodname()` 方法。看起来与 `@classmethod` 很像，但与 `@classmethod` 不同的是，`@staticmethod` **不能**访问类属性和实例属性。

```python
class ClassName:

    @classmethod
    def methodname(arg1, arg2):
        ...

# 用类名调用这个方法
ClassName.methodname(arg1, arg2)

# 或者用实例调用这个方法
object = ClassName()
object.methodname(arg1, arg2)
```

## 主要用法

使用 `staticmethod` 时需要注意：

* `classmethod` 可以定义一个静态方法。
* 这个静态方法的参数没有 `cls`。
* 静态方法不能访问实例属性，即不能调用 `self`。
* 定义好这个类方法之后，可以用类来调用 `ClassName.methodname()`， 也可以用对象来调用 `object = ClassName(); object.methodname()`。
* 这个类方法可以返回类的一个实例对象。

## 案例

一个基本的例子：

```python
class Student:
    name = 'unknown' # 类属性
    
    def __init__(self):
        self.age = 20  # 实例属性

    @staticmethod
    def tostring():
        print('Student Class')
```

```python
>>> Student().tostring()
Student Class
>>> s = Student()
>>> s.tostring()
Student Class
```

`tostring()` 被 `@staticmethod` 修饰。但 `tostring()` 既没有 `cls` 也不能去访问 `self`。

如果 `@staticmethod` 方法访问类属性或者实例属性，比如下面的例子：

```python
class Student:
    name = 'unknown' # 类属性
    
    def __init__(self):
        self.age = 20  # 实例属性

    @staticmethod
    def tostring():
        print(f"age={self.age}")
        print(f"name={name}")
```

会报错：NameError: name 'name' is not defined。

```python
>>> Student().tostring()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 7, in tostring
NameError: name 'self' is not defined
```
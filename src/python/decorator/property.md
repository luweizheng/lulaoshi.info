---
title: property
head:
  - - meta
    - name: keywords
      content: property, 装饰器, python
description: "Python @property"
order: 1
category: [Python]
article: false
---

## 属性访问

面向对象编程语言中，在定义一个类时，一般需要定义一些实例和类属性。然后通过对象实例或者类去访问这些属性。属性是对象的内部状态。在编程时，就是在访问或者修改这些属性。

通常有两种方法来管理属性：

* 直接访问和改变属性值
* 使用方法

这里的方法是专门处理属性值的函数，通常是 `getter`、 `setter` 方法。比如，一个描述二维平面坐标的类 `Point`，它有两个实例属性 `x` 和 `y`，并通过 `get_x` 和 `set_x` 方法来访问和修改属性值 `x`，`y` 与之类似。那一个简单的 Python 例子如下：

```python {6-7,9-10}
class Point:
    def __init__(self, x, y):
        self._x = x
        self._y = y

    def get_x(self):
        return self._x

    def set_x(self, value):
        self._x = value

    def get_y(self):
        return self._y

    def set_y(self, value):
        self._y = value
```

::: tip "Python 没有 private public 关键字"

Python 没有 `private`、`protected` 或 `public` 关键字，这与 C++ 或 Java 这种语言有所区别。所以，如果一个类的属性不想被公开访问，可以使用下划线 `_`。这是 Python 社区一种约定俗称的惯例。比如，`Point` 类中定义的这个 `_x` 并不想公开被访问。但惯例仅仅是惯例，并不是强制规定，其实，程序员是可以通过 `obj._x` 来访问这个属性的。
:::

去访问 `Point` 的属性，可以通过 `get_x` 和 `set_x` 方法；也可以直接访问 `_x` 属性。

```python
>>> point = Point(1, 1)
>>> point.get_x()
1
>>> point.set_x(2)
>>> point._x
2
```

C++ 和 Java 这种编程语言基本使用上面提到的 `getter` 和 `setter` 方法的套路。比起直接访问属性值，这种使用方法的方式有一个好处：假如一开始设计的时候我们起名为 `_x` 并提供 `get_x` 方法，这个程序后面被其他用户调用；后来发现，用 `_x` 作为属性名字不太合适，想改名为 `_i`。那需要把属性名字从 `_x` 改为 `_i`，如果用户原来都是用 `obj._x` 的方式访问这个属性的话，现在属性名变了，继续用原来的方式就会报错。但是我们有 `get_x` 方法，改一下这个方法就好了：

```python
def get_x(self, value):
    return self._i
```

所以，`getter` 和 `setter` 方法的作用是：API不变，用户的代码不用动。

## property: a pythonic way

上面展示的这个例子在 C++ 和 Java 编程语言中很常见，但是不够 pythonic。一种 pythonic 的方式是使用 `property`。具体而言，使用 `property` 装饰器：

```python {6-15}
class Point:
    def __init__(self, x, y):
        self._x = x
        self._y = y

    @property
    def x(self):
        """The x property."""
        print("get x")
        return self._x

    @x.setter
    def x(self, value):
        print("set x")
        self._x = value

    @property
    def y(self):
        """The y property."""
        print("get y")
        return self._y

    @y.setter
    def y(self, value):
        print("set y")
        self._y = value
```

```python
>>> point = Point(1, 1)
>>> point.x
get x
1
>>> point.x = 2
set x
>>> point.x
get x
2
```

总结起来，使用 `property` 装饰器时：

* `@property` 装饰 **getter 方法**，也就是我们希望给用户暴露的属性名。
* docstring 写在 **getter 方法** 里。
* setter 或 deleter 方法： **getter 方法名.setter** 或 **getter 方法名.deleter**。

## 案例：输入值验证

`property` 一个重要功能就是在用户输入时进行验证，拒绝一些错误的输入值，并抛出异常。

还以刚才的 `Point` 为例，`_x` 和 `_y` 应该是数字，而非字符串。Python 是弱类型的，用户可能不注意输入值的类型，假如用户输入一个字符串赋值给 `x`，应该抛异常。

```python {10-16}
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    @property
    def x(self):
        return self._x

    @x.setter
    def x(self, value):
        try:
            self._x = float(value)
            print("Validated!")
        except ValueError:
            raise ValueError('"x" must be a number') from None

    @property
    def y(self):
        return self._y

    @y.setter
    def y(self, value):
        try:
            self._y = float(value)
            print("Validated!")
        except ValueError:
            raise ValueError('"y" must be a number') from None
```

在这个例子中，`setter` 方法在输入时进行了检查，如果不能转成浮点数，则抛出异常。值得注意的是，`__init__` 方法在初始化一个新实例时也调用了 setter 方法。

```
>>> point = Point(1, 1)
Validated!
Validated!
>>> point.x
1.0
>>> point.x = 2
Validated!
>>> point.x = "one"
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 14, in x
ValueError: "x" must be a number
```

**参考资料**

* [https://realpython.com/python-property/](https://realpython.com/python-property/)
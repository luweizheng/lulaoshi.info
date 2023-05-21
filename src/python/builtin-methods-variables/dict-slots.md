---
title: __dict__ 与 __slots__ 变量
head:
  - - meta
    - name: keywords
      content: dict, slots, 内置变量, python
description: "Python __dict__ 与 __slots__"
order: 1
category: [Python]
article: false
---

## __dict__

作为一个动态类型语言，Python 的类中可以声明或者添加各种属性。Python 的这些属性实际上被放在名为 `__dict__` 的变量中。看到名字中的 dict 可以知道，这个变量是个字典。

```python
class MyClass:
    """
    This is a test class.
    """
    class_attribute = "Class" # 类属性
    
    def __init__(self):
        self.instance_attribute = "Instance" # 实例属性
```

Python 将类属性 `class_attribute` 和实例属性 `instance_attribute` 放置在了 `__dict__` 中，打印一下：

```python
>>> my_object = MyClass()
>>> print(my_object.__dict__)
{'instance_attribute': 'Instance'}
```

可以看到，`instance_attribute` 是实例的属性，它存放在对象实例 `my_object` 的 `__dict__` 字典中。

```python
>>> print(MyClass.__dict__)
{'__module__': '__main__', 
'__doc__': '\n    This is a test class.\n    ', 
'class_attribute': 'Class', 
'__init__': <function MyClass.__init__ at 0x7fd3c51aa268>, 
'__dict__': <attribute '__dict__' of 'MyClass' objects>, 
'__weakref__': <attribute '__weakref__' of 'MyClass' objects>}
```

`class_attribute` 是类属性，它存放在 `MyClass` 类的 `__dict__`。同时，也可以看到，类的 `__dict__` 除了有用户自己定义的 `class_attribute` 类属性外，还有类自带的 `__init__` 方法；`__doc__` 等等。

## __slots__

另外一个跟 `__dict__` 具有相似功能但是性能更好的内置属性是 `__slots__`。`__slots__` 显式地定义实例属性，并且还有以下性能优势：

* 访问属性的速度更快
* 更节省内存

使用 `__slots__` 定义一个属性，属性名为 `value`：

```python {2}
class SlottedClass:
    __slots__ = ['value']
    
    def __init__(self, i):
        self.value = i
```

属性的使用方式跟默认情况相同：

```python
>>> slotted = SlottedClass(42)
>>> slotted.value
42
```

不过，在这个类中，我们被限制只能使用 `__slots__` 定义的属性，访问其他属性将会报错，并抛出 `AttributeError` 异常。有点像静态语言 Java、C++ 那味了。

```python
>>> slotted.other_value = 21
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'SlottedClass' object has no attribute 'other_value'
```

用 `__slots__` 定义属性时，可以用 `()`、`[]` 甚至 `,`隔开：

```python
__slots__ = (a, b)
__slots__ = ['a', 'b']
__slots__ = a, b
```

## 为什么要用 __slots__

只能访问 `__slots__` 定义的属性，虽然有些不方便，但是会得到性能的大幅提升。

一些简单的代码就可以测试属性访问速度：

```python
class Foo: 
    __slots__ = 'foo',

class Bar: 
    pass

slotted = Foo()
not_slotted = Bar()

def get_set_delete_fn(obj):
    # 写入、访问、删除 foo 属性
    def get_set_delete():
        obj.foo = 'foo'
        obj.foo
        del obj.foo
    return get_set_delete
```

在我的 Macbook Pro 上有 20% 以上的性能提升：

```python
>>> import timeit
>>> min(timeit.repeat(get_set_delete_fn(slotted)))
0.10804226202890277
>>> min(timeit.repeat(get_set_delete_fn(not_slotted)))
0.14347736403578892
```

据著名的 Python 数据库 ORM 库 SQLAlchemy [报告](https://docs.sqlalchemy.org/en/20/changelog/migration_10.html#significant-improvements-in-structural-memory-use)，使用 `__slots__` 而非默认的 `__dict__`，在一些场景下，将节省 46% 的内存占用。

## __slots__ 类继承

正常情况下，`__slots__` 可以被继承：

```python
class BaseA: 
    __slots__ = ('a',)

class A(BaseA):
    pass

instance_a = A()
instance_a.a = 10
```

Python 允许多继承，这种场景下，容易出问题：

```python
class BaseA: 
    __slots__ = ('a',)

class BaseB: 
    __slots__ = ('b',)

class Child(BaseA, BaseB): 
    __slots__ = ('a', 'b')
```

抛出异常：`Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: multiple bases have instance lay-out conflict`

所以，这种多继承的场景，要把父类的 `__slots__` 删掉，或者设置 `__slots__ = ()`，下面两种写法都可以：

```python
class BaseA: 
    pass

class BaseB: 
    pass

class Child(BaseA, BaseB): 
    __slots__ = ('a', 'b')
```

```python
class BaseA: 
    __slots__ = ()

class BaseB: 
    __slots__ = ()

class Child(BaseA, BaseB): 
    __slots__ = ('a', 'b')
```

## __slots__ 与 __dict__ 结合

如果不想放弃 `__dict__` 提供的动态添加属性的功能，还可以把 `__dict__` 嵌套进 `__slots__` 中：

```python {2}
class Foo:
    __slots__ = 'bar', 'baz', '__dict__'

foo = Foo()
foo.xyz = 'xyz'
```

**参考资料**

* [https://stackoverflow.com/questions/472000/usage-of-slots](https://stackoverflow.com/questions/472000/usage-of-slots)
* [https://bas.codes/posts/python-dict-slots](https://bas.codes/posts/python-dict-slots)


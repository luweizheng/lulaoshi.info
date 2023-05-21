---
title: classmethod
head:
  - - meta
    - name: keywords
      content: classmethod, 装饰器, python
description: "Python @classmethod"
order: 3
category: [Python]
article: false
---

## 基本功能和案例

`@classmethod` 是 Python 自带的装饰器之一，它用在一个类名为 `ClassName` 下的 `methodname()` 函数上，装饰之后就可以使用 `ClassName.methodname()` 的方式调用这个 `methodname()` 方法，还可以使用类的对象实例调用这个 `methodname()` 方法。

```python
class ClassName:

    @classmethod
    def methodname(cls, arg1, arg2):
        ...

# 用类名调用这个方法
ClassName.methodname(arg1, arg2)

# 或者用实例调用这个方法
object = ClassName()
object.methodname(arg1, arg2)
```

`@classmethod` 本质是 `classmethod()` 函数。用 `@classmethod` 装饰器装饰到函数头上，写起来更简洁。

一个完整可运行的案例：

```python {6-8}
class Student:
    name = 'unknown' # 类属性
    def __init__(self, age=12):
        self.age = age  # 实例属性

    @classmethod
    def tostring(cls, school=None):
        print(f'Student Class Attributes: name={cls.name}, school={school}')
```

```python
>>> Student().tostring("Columbus High School")
Student Class Attributes: name=unknown, school=Columbus High School

>>> s = Student(10)
>>> s.tostring()
Student Class Attributes: name=unknown, school=None
```

## 主要用法

使用 `classmethod` 时需要注意：

* `classmethod` 可以定义一个类方法。
* 这个类方法的第一个参数*必须*是 `cls`，`cls` 用来访问类属性。
* 类方法只能访问类属性，不能访问实例属性。
* 定义好这个类方法之后，可以用类来调用 `ClassName.methodname()`， 也可以用对象来调用 `object = ClassName(); object.methodname()`。
* 这个类方法可以返回类的一个实例对象，因此这个功能也可以用来实现工厂设计模式。

回到 `Student` 类的例子，`Student` 有类属性 `name` 和实例属性 `age`。 `tostring()` 方法被 `@classmethod` 装饰，可以用 `Student().tostring()` 来调用。`tostring()` 的第一个参数是 `cls`，`cls.name` 用来访问类属性。也可以声明一个实例：`s = Student(10)`，然后通过实例来调用：`s.tostring()`。

`classmethod` 只能访问类属性，不能访问实例属性，如果访问实例属性会报错。

比如，下面这个例子中的 `cls.age` 访问了实例属性：

```python {6-9}
class Student:
    name = 'unknown' # 类属性
    def __init__(self):
        self.age = 20  # 实例属性

    @classmethod
    def tostring(cls):
        # cls.age 访问了实例属性，会报错！
        print('Student Class Attributes: name=',cls.name,', age=', cls.age)
```

会报错：AttributeError: type object 'Student' has no attribute 'age'。

```python
>>> Student().tostring()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 8, in tostring
AttributeError: type object 'Student' has no attribute 'age'
```

## 工厂设计模式

由于 `classmethod` 装饰的方法可以返回一个实例对象，因此可以被用来实现工厂设计模式。

```python
class Student:
    
    def __init__(self, name, age):
        self.name = name  # 实例属性
        self.age = age # 实例属性

    @classmethod
    def getobject(cls):
        return cls('Steve', 25)
```

```
>>> steve = Student.getobject()
>>> print(steve.name, steve.age)
Steve 25
```

## classmethod v.s. staticmethod

|   	| @classmethod 	| @staticmethod 	|
|---	|--------------	|---------------	|
|调用方式|相同，可以是 `ClassName.methodname()` 也可以是 `object.methodname()`|相同，可以是 `ClassName.methodname()` 也可以是 `object.methodname()`|
|访问属性|不同，可以访问类属性，不能访问实例属性|不同，不能访问类属性，也不能访问实例属性|
|返回实例|可以返回一个对象实例，因此可用来实现工厂设计模式|可以返回对象实例|

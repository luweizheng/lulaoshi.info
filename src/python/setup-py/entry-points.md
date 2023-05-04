---
title: entry_points：程序的入口
head:
  - - meta
    - name: keywords
      content: setup.py, entry_points：Python, python
description: "Python setup.py entry_points 详解"
order: 1
category: [Python]
article: false
---

本文主要对[这篇博客](https://amir.rachum.com/blog/2017/07/28/python-entry-points/)进行了翻译解读，以解释 Python `setup.py` 文件中 `entry_point` 用法。

## 第一个简单的 Python 包：snek{#first-simple-python-package-snek}

我作为技术合伙人兼任CTO与其他人合伙成立了一家软件公司。软件公司的第一个 Python 产品名为 snek，这个软件可以在屏幕上画出一条蛇。我写下了公司第一行代码，得到如下 Python 文件 `snek.py` ：

```python title="snek/snek.py"
ascii_snek = """\
    --..,_                     _,.--.
       `'.'.                .'`__ o  `;__.
          '.'.            .'.'`  '---'`  `
            '.`'--....--'`.'
              `'--....--'`
"""

def main():
    print(ascii_snek)

if __name__ == '__main__':
    main()
```

代码编写好了，可以给投资人和客户们演示了！

不过，这个程序需要我们在命令行里，使用 `python snek.py` 的方式调用。打开命令行 ，使用 `cd` 命令进入到工程目录，也就是存放 `snek.py` 的文件夹，执行 `python snek.py` 看一下效果：程序能跑起来了！

```shell
$ python snek.py
    --..,_                     _,.--.
       `'.'.                .'`__ o  `;__.
          '.'.            .'.'`  '---'`  `
            '.`'--....--'`.'
              `'--....--'`
```

## setup.py 打包安装{#package-by-setup-py}

但是客户可能不太了解 Python、命令行、`cd` 这些东西，客户只想简单一些，比如不需要 `cd`，打开命令行，执行一个命令就能画出这条蛇。因此，作为技术合伙人，我需要把这个 `snek.py` 包装一下，打包成一个软件，这让客户可以安装这个软件，并且打开命令行，直接执行。在对 `snek.py` 这个 Python 文件打包时，需要一个重要的文件：`setup.py` 。`setup.py` 文件含有 这个 Python 包的名称、开发者是谁、还依赖哪些软件等。`setup.py` 中还有一个重要的功能：它可以用于注册 entry_points 。后面会用代码来解释 entry_points 到底是干嘛的。

```python title="snek/setup.py"
from setuptools import setup

setup(
    name='snek',
    entry_points={
        'console_scripts': [
            'snek = snek:main',
        ],
    }
)
```

在上面这段代码里， `console_scripts` 是一种特殊的 entry_points 。 `setuptools` 从中读取 `"<console_script_name> = <python_package:object_name>"` 。当把这个 Python 包安装好后，它会自动创建一个命令行工具。后文还会细讲 ``"<console_script_name> = <python_package:object_name>"`` 对应的内容。现在，我们先在本地用开发者模式安装这个包：

```shell
$ python setup.py develop

running develop
running egg_info
writing snek.egg-info\PKG-INFO
writing dependency_links to snek.egg-info\dependency_links.txt
writing entry points to snek.egg-info\entry_points.txt
writing top-level names to snek.egg-info\top_level.txt
reading manifest file 'snek.egg-info\SOURCES.txt'
writing manifest file 'snek.egg-info\SOURCES.txt'
running build_ext
Creating c:\program files (x86)\py36-32\lib\site-packages\snek.egg-link (link to .)
snek 0.0.0 is already the active version in easy-install.pth
Installing snek-script.py script to C:\Program Files (x86)\Py36-32\Scripts
Installing snek.exe script to C:\Program Files (x86)\Py36-32\Scripts
Installing snek.exe.manifest script to C:\Program Files (x86)\Py36-32\Scripts

Installed c:\users\rachum\notebooks
Processing dependencies for snek==0.0.0
Finished processing dependencies for snek==0.0.0
```

上面这段输出中，一个重要的信息是，这个名为 `snek` 的 Python 包被安装到了 `C:\Program Files (x86)\Py36-32\Scripts` 里面。

现在，我们可以打开命令行，不需要 `cd` 到这个存放代码的目录，在任何位置，执行这个 Python 包。好了，至少在公司产品路演上，我们可以给客户和投资人看，我们有一个可以打包安装的产品。

```shell
$ snek
    --..,_                     _,.--.
       `'.'.                .'`__ o  `;__.
          '.'.            .'.'`  '---'`  `
            '.`'--....--'`.'
              `'--....--'`
```

## 更多酷炫的蛇{#more-options}

snek 软件开始流行起来了，拿到了投资，更多人开始用这款软件，我们的开发团队也在扩招，更多程序员加入，于是我们推出功能更加强大的 snek ：

```python title="snek/snek.py"
"""Print an ASCII Snek.

Usage:
    snek [--type=TYPE]

"""
import docopt

normal_snek = """\
    --..,_                     _,.--.
       `'.'.                .'`__ o  `;__.
          '.'.            .'.'`  '---'`  `
            '.`'--....--'`.'
              `'--....--'`
"""

fancy_snek = """\
                          _,..,,,_
                     '``````^~"-,_`"-,_
       .-~c~-.                    `~:. ^-.
   `~~~-.c    ;                      `:.  `-,     _.-~~^^~:.
         `.   ;      _,--~~~~-._       `:.   ~. .~          `.
          .` ;'   .:`           `:       `:.   `    _.:-,.    `.
        .' .:   :'    _.-~^~-.    `.       `..'   .:      `.    '
       :  .' _:'   .-'        `.    :.     .:   .'`.        :    ;
       :  `-'   .:'             `.    `^~~^`   .:.  `.      ;    ;
        `-.__,-~                  ~-.        ,' ':    '.__.`    :'
                                     ~--..--'     ':.         .:'
                                                     ':..___.:'
"""

def get_sneks():
    return {
        'normal': normal_snek,
        'fancy': fancy_snek,
    }


def main():
    args = docopt.docopt(__doc__)
    snek_type = args['--type'] or 'normal'
    print(get_sneks()[snek_type])

if __name__ == '__main__':
    main()
```

新的程序中，增加了不同形状的蛇，而且给用户选项，一种普通版本的蛇叫 `normal`，另一种时尚版本的蛇叫 `fancy` 。给用户选项，让用户做选择。再次运行：

```text
$ snek
    --..,_                     _,.--.
       `'.'.                .'`__ o  `;__.
          '.'.            .'.'`  '---'`  `
            '.`'--....--'`.'
              `'--....--'`

$ snek --type fancy
                          _,..,,,_
                     '``````^~"-,_`"-,_
       .-~c~-.                    `~:. ^-.
   `~~~-.c    ;                      `:.  `-,     _.-~~^^~:.
         `.   ;      _,--~~~~-._       `:.   ~. .~          `.
          .` ;'   .:`           `:       `:.   `    _.:-,.    `.
        .' .:   :'    _.-~^~-.    `.       `..'   .:      `.    '
       :  .' _:'   .-'        `.    :.     .:   .'`.        :    ;
       :  `-'   .:'             `.    `^~~^`   .:.  `.      ;    ;
        `-.__,-~                  ~-.        ,' ':    '.__.`    :'
                                     ~--..--'     ':.         .:'
                                                     ':..___.:'
```

## 更多开发者加入进来{#more-developers}

越来越多的人都开始用这款软件，我们自己的软件团队已经无法满足客户的需求。第三方开发者希望能够在我们发行的软件基础上进行二次开发，我们在 `snek.py` 上改进，兼容其他开发者：

```python title="snek.py"
"""Print an ASCII Snek.

Usage:
    snek [--type=TYPE]

"""
import docopt
import pkg_resources

normal_snek = """\
    --..,_                     _,.--.
       `'.'.                .'`__ o  `;__.
          '.'.            .'.'`  '---'`  `
            '.`'--....--'`.'
              `'--....--'`
"""

fancy_snek = """\
                          _,..,,,_
                     '``````^~"-,_`"-,_
       .-~c~-.                    `~:. ^-.
   `~~~-.c    ;                      `:.  `-,     _.-~~^^~:.
         `.   ;      _,--~~~~-._       `:.   ~. .~          `.
          .` ;'   .:`           `:       `:.   `    _.:-,.    `.
        .' .:   :'    _.-~^~-.    `.       `..'   .:      `.    '
       :  .' _:'   .-'        `.    :.     .:   .'`.        :    ;
       :  `-'   .:'             `.    `^~~^`   .:.  `.      ;    ;
        `-.__,-~                  ~-.        ,' ':    '.__.`    :'
                                     ~--..--'     ':.         .:'
                                                     ':..___.:'
"""

def get_sneks():
    sneks = {
        'normal': normal_snek,
        'fancy': fancy_snek,
    }
    for entry_point in pkg_resources.iter_entry_points('snek_types'):
        sneks[entry_point.name] = entry_point.load()
    return sneks


def main():
    args = docopt.docopt(__doc__)
    snek_type = args['--type'] or 'normal'
    print(get_sneks()[snek_type])

if __name__ == '__main__':
    main()
```

在上面这段代码中，增加了：

```python
    for entry_point in pkg_resources.iter_entry_points('snek_types'):
        sneks[entry_point.name] = entry_point.load()
```

`pkg_resources.iter_entry_points('snek_types')` 将遍历 **当前系统** 所安装的所有名为 `snek_types` 的 entry_points 。如果其他的包在 `setup.py` 中定义了叫 `"snek_types"` 的 entry_points ，将会在 snek 运行时动态加载进来。

比如说，第三方开发者能够画出更加酷炫的蛇，另外创建了一个工程，名为 `cute_snek` ，并且在里面编写了 `cute_snek.py`

```python title="cute_snek/cute_snek.py"
cute_snek = r"""
                    /^\/^\
                  _|__|  O|
         \/     /~     \_/ \
          \____|__________/  \
                 \_______      \
                         `\     \                 \
                           |     |                  \
                          /      /                    \
                         /     /                       \
                       /      /                         \ \
                      /     /                            \  \
                    /     /             _----_            \   \
                   /     /           _-~      ~-_         |   |
                  (      (        _-~    _--_    ~-_     _/   |
                   \      ~-____-~    _-~    ~-_    ~-_-~    /
                     ~-_           _-~          ~-_       _-~ 
                        ~--______-~                ~-___-~
"""
```

第三方开发者将其打包成 `cute_snek`， 同时也需要让我们最原始的 `snek` 知道如何找到 cute snek 。

```python title="cute_snek/setup.py"
from setuptools import setup

setup(
    name='cute_snek',
    entry_points={
        'snek_types': [
            'cute = cute_snek:cute_snek',
        ],
    }
)
```

这时候，需要在 `cute_snek` 包的 `setup.py` 中的 `entry_points` 里注册 `cute_snek` 变量。

现在我们又安装了 `cute_snek`：

```shell
$ cd cute_snek_folder 
$ python setup.py develop
running develop
running egg_info
writing cute_snek.egg-info\PKG-INFO
writing dependency_links to cute_snek.egg-info\dependency_links.txt
writing entry points to cute_snek.egg-info\entry_points.txt
writing top-level names to cute_snek.egg-info\top_level.txt
reading manifest file 'cute_snek.egg-info\SOURCES.txt'
writing manifest file 'cute_snek.egg-info\SOURCES.txt'
running build_ext
Creating c:\program files (x86)\py36-32\lib\site-packages\cute-snek.egg-link (link to .)
cute-snek 0.0.0 is already the active version in easy-install.pth

Installed c:\users\rachum\cute_snek
Processing dependencies for cute-snek==0.0.0
Finished processing dependencies for cute-snek==0.0.0
```

运行 `snek` 命令， cute snek 将从 `cute_snek` 包中动态加载进来。

```shell
$ snek --type cute
                    /^\/^\
                  _|__|  O|
         \/     /~     \_/ \
          \____|__________/  \
                 \_______      \
                         `\     \                 \
                           |     |                  \
                          /      /                    \
                         /     /                       \
                       /      /                         \ \
                      /     /                            \  \
                    /     /             _----_            \   \
                   /     /           _-~      ~-_         |   |
                  (      (        _-~    _--_    ~-_     _/   |
                   \      ~-____-~    _-~    ~-_    ~-_-~    /
                     ~-_           _-~          ~-_       _-~ 
                        ~--______-~                ~-___-~
```

## 重构snek包{#snek-refactor}

既然第三方的 cute snek 可以动态加载进来，那么原始的 snek 呢？其实，所有的 snek 都是可以动态加载的。我们对原始的 `snek.py` 进行了重构，都使用动态加载的方式。

```diff
--- a/snek.py
+++ b/snek.py
@@ -31,10 +31,7 @@ fancy_snek = """\
 """

 def get_sneks():
-    sneks = {
-        'normal': normal_snek,
-        'fancy': fancy_snek,
-    }
+    sneks = {}
     for entry_point in pkg_resources.iter_entry_points('snek_types'):
         sneks[entry_point.name] = entry_point.load()
     return sneks
```

原始的 snek 也像 cute snek 一样，在 `setup.py` 中注册。

```diff
--- a/setup.py
+++ b/setup.py
@@ -6,5 +6,9 @@ setup(
         'console_scripts': [
             'snek = snek:main',
        ],
+       'snek_types': [
+           'normal = snek:normal_snek',
+           'fancy = snek:fancy_snek',
+       ],
     },
 )
```

改完后的 `snek/snek.py` 和 `snek/setup.py` 长这样：

```python title="snek/snek.py"
"""Print an ASCII Snek.

Usage:
    snek [--type=TYPE]
    
"""
import docopt
import pkg_resources

normal_snek = """\
    --..,_                     _,.--.
       `'.'.                .'`__ o  `;__.
          '.'.            .'.'`  '---'`  `
            '.`'--....--'`.'
              `'--....--'`
"""

fancy_snek = """\
                          _,..,,,_
                     '``````^~"-,_`"-,_
       .-~c~-.                    `~:. ^-.
   `~~~-.c    ;                      `:.  `-,     _.-~~^^~:.
         `.   ;      _,--~~~~-._       `:.   ~. .~          `.
          .` ;'   .:`           `:       `:.   `    _.:-,.    `.
        .' .:   :'    _.-~^~-.    `.       `..'   .:      `.    '
       :  .' _:'   .-'        `.    :.     .:   .'`.        :    ;
       :  `-'   .:'             `.    `^~~^`   .:.  `.      ;    ;
        `-.__,-~                  ~-.        ,' ':    '.__.`    :'
                                     ~--..--'     ':.         .:'
                                                     ':..___.:'
"""

def get_sneks():
    sneks = {}
    for entry_point in pkg_resources.iter_entry_points('snek_types'):
        sneks[entry_point.name] = entry_point.load()
    return sneks


def main():
    args = docopt.docopt(__doc__)
    snek_type = args['--type'] or 'normal'
    print(get_sneks()[snek_type])
    
if __name__ == '__main__':
    main()
```

```python title="snek/setup.py"
from setuptools import setup

setup(
    name='snek',
    entry_points={
        'console_scripts': [
            'snek = snek:main',
        ],
        'snek_types': [
            'normal = snek:normal_snek',
            'fancy = snek:fancy_snek',
       ],
    }
)
```

重新安装 snek：

```text
$ cd snek_folder
$ python setup.py develop
running develop
running egg_info
writing snek.egg-info\PKG-INFO
writing dependency_links to snek.egg-info\dependency_links.txt
writing entry points to snek.egg-info\entry_points.txt
writing top-level names to snek.egg-info\top_level.txt
reading manifest file 'snek.egg-info\SOURCES.txt'
writing manifest file 'snek.egg-info\SOURCES.txt'
running build_ext
Creating c:\program files (x86)\py36-32\lib\site-packages\snek.egg-link (link to .)
snek 0.0.0 is already the active version in easy-install.pth
Installing snek-script.py script to C:\Program Files (x86)\Py36-32\Scripts
Installing snek.exe script to C:\Program Files (x86)\Py36-32\Scripts
Installing snek.exe.manifest script to C:\Program Files (x86)\Py36-32\Scripts

Installed c:\users\rachum\notebooks
Processing dependencies for snek==0.0.0
Finished processing dependencies for snek==0.0.0
```

```text
$ snek
    --..,_                     _,.--.
       `'.'.                .'`__ o  `;__.
          '.'.            .'.'`  '---'`  `
            '.`'--....--'`.'
              `'--....--'`

$ snek --type fancy
                          _,..,,,_
                     '``````^~"-,_`"-,_
       .-~c~-.                    `~:. ^-.
   `~~~-.c    ;                      `:.  `-,     _.-~~^^~:.
         `.   ;      _,--~~~~-._       `:.   ~. .~          `.
          .` ;'   .:`           `:       `:.   `    _.:-,.    `.
        .' .:   :'    _.-~^~-.    `.       `..'   .:      `.    '
       :  .' _:'   .-'        `.    :.     .:   .'`.        :    ;
       :  `-'   .:'             `.    `^~~^`   .:.  `.      ;    ;
        `-.__,-~                  ~-.        ,' ':    '.__.`    :'
                                     ~--..--'     ':.         .:'
                                                     ':..___.:'

$ snek --type cute
                    /^\/^\
                  _|__|  O|
         \/     /~     \_/ \
          \____|__________/  \
                 \_______      \
                         `\     \                 \
                           |     |                  \
                          /      /                    \
                         /     /                       \
                       /      /                         \ \
                      /     /                            \  \
                    /     /             _----_            \   \
                   /     /           _-~      ~-_         |   |
                  (      (        _-~    _--_    ~-_     _/   |
                   \      ~-____-~    _-~    ~-_    ~-_-~    /
                     ~-_           _-~          ~-_       _-~ 
                        ~--______-~                ~-___-~
```

## 完整逻辑{#conclusion}

总结一下，我们自己的团队开发了一款名为 snek 的软件，源代码包括如下：

```text
snek
├── setup.py
└── snek.py
```

第三方开发者开发了一款名为 cute_snek 的软件，源代码包括如下：

```text
cute_snek
├── cute_snek.py
└── setup.py
```

分别 `cd` 到两款软件源代码目录，用 `python setup.py develop` 方式，将源代码打包安装到当前系统内。由于两个软件的 `setup.py` 中 `entry_points` 都注册了名为 `snek_types` 的字段，Python 执行时会去系统中寻找所有注册过的值。虽然代码分散在不同的地方、不同的包，但是都可以被动态加载进来。

```python
        'snek_types': [
            'normal = snek:normal_snek',
        ]
```

在上面这段 `entry_points` 注册代码中，共有两层，第一层：`snek_types`，第二层： `cute` / `normal` / `fancy`。 `'normal = snek:normal_snek'` 中  `snek:normal_snek` 部分，冒号左侧是包名，冒号右侧为变量名或者方法名。

```python
    for entry_point in pkg_resources.iter_entry_points('snek_types'):
        sneks[entry_point.name] = entry_point.load()
```

上面这段代码中的 for 循环会对所有 entry_points 进行注册和加载。 比如，for 循环中某个 `entry_point` 就是 `'normal = snek:normal_snek'`。 `entry_point.load()` 将包名为 `snek` 中的 `normal_snek` 变量加载进来。 `'normal = snek:normal_snek'` 符合如下规则：`"<user_defined_key> = <python_package:object_name>"`， `<user_defined_key>` 是开发者定义的跟业务高度相关的 Key，`<python_package:object_name>` 为 Python 对象名（变量或者方法）。

有一种特殊的 entry_points ，名为 `console_scripts`。在这里注册的内容可以直接被集成为命令行工具。

```python
        'console_scripts': [
            'snek = snek:main',
        ]
```

在上面这个例子中，`'snek = snek:main'` 等号左侧的 `snek` 是命令行工具的名字，等号右侧是“包名:包内对应的方法名”。 `"<console_script_name> = <python_package:object_name>"` 这样的模式，`<console_script_name>` 为生成的命令行工具的名字， `<python_package:object_name>` 为 Python 对象名（变量或者方法）。

## 应用场景{#application}

那到底实际有哪些应用场景？

著名科学数据分享平台 [zenodo](https://zenodo.org/) 是在 Python Web 框架 Flask 下继续进行开发的，它由很多个包组成。在开发时，就大量使用了 entry_points 来注册具有相互继承关系的包之间需要同时注册的变量或者方法。
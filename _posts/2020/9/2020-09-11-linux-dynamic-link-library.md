---
title:  "Linux的so文件到底是干嘛的？浅析Linux的动态链接库"
date:   2020-09-11 16:24:41 +0800
description: "动态链接与静态链接有什么区别？so文件到底是干嘛的？Linux上的动态链接库如何命名？编程时如何链接？"
categories: [编译器]
---

[上一篇](/blog/2020/09/08/compile-c-hello-world-on-linux.html)我们分析了Hello World是如何编译的，即使一个非常简单的程序，也需要依赖C标准库和系统库，**链接**其实就是把其他第三方库和自己源代码生成的二进制目标文件融合在一起的过程。经过链接之后，那些第三方库中定义的函数就能被调用执行了。早期的一些操作系统一般使用静态链接的方式，现在基本上都在使用动态链接的方式。

## 静态链接和动态链接

虽然静态链接和动态链接都能生成可执行文件，但两者的代价差异很大。下面这张图可以很形象地演示了动态链接和静态链接的区别：

![动态链接 v.s 静态链接](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-09-11-070559.png){: .align-center}
*动态链接 v.s 静态链接*

左侧的人就像是一个动态链接的可执行文件，右侧的海象是一个静态链接的可执行文件。比起人，海象臃肿得多，那是因为静态链接在链接的时候，就把所依赖的第三方库函数都打包到了一起，导致最终的可执行文件非常大。而动态链接在链接的时候并不将那些库文件直接拿过来，而是在运行时，发现用到某些库中的某些函数时，再从这些第三方库中读取自己所需的方法。

我们把编译后但是还未链接的二进制机器码文件称为目标文件（Object File），那些第三方库是其他人编译打包好的目标文件，这些库里面包含了一些函数，我们可以直接调用而不用自己动手写一遍。在编译构建自己的可执行文件时，使用静态链接的方式，其实就是将所需的静态库与目标文件打包到一起。最终的可执行文件除了有自己的程序外，还包含了这些第三方的静态库，可执行文件比较臃肿。相比而言，动态链接不将所有的第三方库都打包到最终的可执行文件上，而是只记录用到了哪些动态链接库，在运行时才将那些第三方库装载（Load）进来。装载是指将磁盘上的程序和数据加载到内存上。例如下图中的Program 1，系统首先加载Program 1，发现它依赖`libx.so`后才去加载`libx.so`。

![静态链接（Static Link）和动态链接（Dynamic Link）](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2020-09-11-070955.png){: .align-center}
*静态链接（Static Link）和动态链接（Dynamic Link）*

所以，静态链接就像GIF图中的海象，把所需的东西都带在了身上。动态链接只把精简后的内容带在自己身上，需要什么，运行的时候再去拿。

不同操作系统的动态链接库文件格式稍有不同，Linux称之为共享目标文件（Shared Object），文件后缀为`.so`，Windows的动态链接库（Dynamic Link Library）文件后缀为`.dll`。

## 地址无关

无论何种操作系统上，使用动态链接生成的目标文件中凡是涉及第三方库的函数调用都是**地址无关**的。假如我们自己编写的程序名为Program 1，Program 1中调用了C标准库的`printf()`，在生成的目标文件中，不会立即确定`printf()`的具体地址，而是在运行时去装载这个函数，在装载阶段确定`printf()`的地址。这里提到的地址指的是进程在内存上的虚拟地址。动态链接库的函数地址在编译时是不确定的，在装载时，装载器根据当前地址空间情况，动态地分配一块虚拟地址空间。

而静态链接库其实是在编译时就确定了库函数地址。比如，我们使用了`printf()`函数，`printf()`函数对应有一个目标文件`printf.o`，静态链接时，会把`printf.o`链接打包到可执行文件中。在可执行文件中，`printf()`函数相对于文件头的偏移量是确定的，所以说它的地址在编译链接后就是确定的。

## 动态链接的优缺点

相比之下，动态链接主要有以下好处：

* 多个可执行文件可以共享使用系统中的共享库。每个可执行文件都更小，占用的磁盘空间也相对比较小。而静态链接把所依赖的库打包进可执行文件，假如`printf()`被其他程序使用了上千次，就要被打包到上千个可执行文件中，这样会占用了大量磁盘空间。
* 共享库的之间隔离决定了共享库可以进行小版本的代码升级，重新编译并部署到操作系统上，并不影响它被可执行文件调用。静态链接库的任何函数有了改动，除了静态链接库本身需要重新编译构建，依赖这个函数的所有可执行文件都需要重新编译构建一遍。

当然，共享库也有缺点：

* 如果将一份目标文件移植到一个新的操作系统上，而新的操作系统缺少相应的共享库，程序将无法运行，必须在操作系统上安装好相应的库才行。
* 共享库必须按照一定的开发和升级规则升级，不能突然重构所有的接口，且新库文件直接覆盖老库文件，否则程序将无法运行。

## ldd命令查看动态链接库依赖

在Linux上，动态链接库有默认的部署位置，很多重要的库放在了系统的`/lib`和`/usr/lib`两个路径下。一些常用的Linux命令非常依赖`/lib`和`/usr/lib64`下面的各个库，比如：`scp`、`rm`、`cp`、`mv`等Linux下常用的命令非常依赖`/lib`和`/usr/lib64`下的各个库。不小心删除了这些路径，可能导致系统的很多命令和工具都无法继续使用。

我们可以用`ldd`命令查看某个可执行文件依赖了哪些动态链接库。

```bash
# on Ubuntu 16.04 x86_64
$ ldd /bin/ls
  linux-vdso.so.1 =>  (0x00007ffcd3dd9000)
	libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x00007f4547151000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f4546d87000)
	libpcre.so.3 => /lib/x86_64-linux-gnu/libpcre.so.3 (0x00007f4546b17000)
	libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007f4546913000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f4547373000)
	libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007f45466f6000)
```

可以看到，我们经常使用的`ls`命令依赖了不少库，包括了C语言标准库`libc.so`。

如果某个Linux的程序报错提示缺少某个库，可以用`ldd`命令可以用来检查这个程序依赖了哪些库，是否能在磁盘某个路径下找到`.so`文件。如果找不到，需要使用环境变量`LD_LIBRARY_PATH`来调整，下文将介绍环境变量`LD_LIBRARY_PATH`。

## SONAME文件命名规则

`so`文件后面往往跟着很多数字，这表示了不同的版本。`so`文件命名规则被称为SONAME：

```
libname.so.x.y.z
```

lib是前缀，这是一个约定俗成的规则。x为主版本号（Major Version），y为次版本号（Minor Version），z为发布版本号（Release Version）。

* Major Version表示重大升级，不同Major Version之间的库是不兼容的。Major Version升级后，或者依赖旧Major Version的程序需要更新代码，重新编译，才可以在新的Major Version上运行；或者操作系统保留旧Major Version，使得老程序依然能运行。
* Minor Version表示增量更新，一般是增加了一些新接口，原来的接口不变。所以，在Major Version相同的情况下，Minor Version从高到低是兼容的。
* Release Version表示库的一些bug修复，性能改进等，不添加任何新的接口，不改变原来的接口。

但是我们刚刚看到的`.so`只有一个Major Version，因为这是一个软连接，`libname.so.x`软连接到了`libname.so.x.y.z`文件上。

```bash
$ ls -l /lib/x86_64-linux-gnu/libpcre.so.3
/lib/x86_64-linux-gnu/libpcre.so.3 -> libpcre.so.3.13.2
```

因为不同的Major Version之间不兼容，而Minor Version和Release Version都是向下兼容的，软连接会指向Major Version相同，Minor Version和Release Version最高的`.so`文件上。

## 动态链接库查找过程

刚才提到，Linux的动态链接库绝大多数都在`/lib`和`/usr/lib`下，操作系统也会默认去这两个路径下搜索动态链接库。另外，`/etc/ld.so.conf`文件里可以配置路径，`/etc/ld.so.conf`文件会告诉操作系统去哪些路径下搜索动态链接库。这些位置的动态链接库很多，如果链接器每次都去这些路径遍历一遍，非常耗时，Linux提供了`ldconfig`工具，这个工具会对这些路径的动态链接库按照SONAME规则创建软连接，同时也会生成一个缓存Cache到`/etc/ld.so.cache`文件里，链接器根据缓存可以更快地查找到各个`.so`文件。每次在`/lib`和`/usr/lib`这些路径下安装了新的库，或者更改了`/etc/ld.so.conf`文件，都需要调用`ldconfig`命令来做一次更新，重新生成软连接和Cache。但是`/etc/ld.so.conf`文件和`ldconfig`命令最好使用root账户操作。非root用户可以在某个路径下安装库文件，并将这个路径添加到`/etc/ld.so.conf`文件下，再由root用户调用一下`ldconfig`。

对于非root用户，另一种方法是使用`LD_LIBRARY_PATH`环境变量。`LD_LIBRARY_PATH`存放着若干路径。链接器会去这些路径下查找库。非root可以将某个库安装在了一个非root权限的路径下，再将其添加到环境变量中。

动态链接库的查找先后顺序为：

* `LD_LIBRARY_PATH`环境变量中的路径
* `/etc/ld.so.cache`缓存文件
* `/usr/lib`和`/lib`

比如，我们把CUDA安装到`/opt`下面，我们可以使用下面的命令将CUDA添加到环境变量里。

```bash
export LD_LIBRARY_PATH=/opt/cuda/cuda-toolkit/lib64:$LD_LIBRARY_PATH
```

如果在执行某个具体程序前先执行上面的命令，那么这个程序将使用这个路径下的CUDA；如果将这行添加到了`.bashrc`文件，那么该用户一登录就会执行这行命令，因此该用户的所有程序也都将使用这个路径下的CUDA。当同一个动态链接库有多个不同版本的`.so`文件时，可以将他们安装到不同的路径下面，然后使用`LD_LIBRARY_PATH`环境变量来控制使用哪个库。这种比较适合在多人共享的服务器上使用不同版本的库，比如CUDA这种版本变化较快，且深度学习程序又高度依赖的库。

除了`LD_LIBRARY_PATH`环境变量外，还有一个`LD_PRELOAD`环境变量。`LD_PRELOAD`的查找顺序比`LD_LIBRARY_PATH`还要优先。`LD_PRELOAD`是具体的目标文件列表（A  list of shared objects）；`LD_LIBRARY_PATH`是目录列表（A list of directories）。

## GCC编译选项

使用GCC编译链接时，有两个参数需要注意，一个是`-l`（小写的L），一个是`-L`（大写的L）。我们前面曾提到，Linux有个约定速成的规则，假如库名是name，那么动态链接库文件名就是`libname.so`。在使用GCC编译链接时，`-lname`来告诉GCC使用哪个库。链接时，GCC的链接器`ld`就会前往`LD_LIBRARY_PATH`环境变量、`/etc/ld.so.cache`缓存文件和`/usr/lib`和`/lib`目录下去查找`libname.so`。我们也可以用`-L/path/to/library`的方式，让链接器`ld`去`/path/to/library`路径下去找库文件。

如果动态链接库文件在`/path/to/library`，库名叫name，编译链接的方式如下：

```bash
$ gcc -L/path/to/library -lname myfile.c
```
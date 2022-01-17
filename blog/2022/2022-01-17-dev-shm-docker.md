---
title:  "Docker /dev/shm 默认设置引发的血案"
date:   2022-01-17 16:19:00 +0800
description: "/dev/shm的作用"
categories: [Linux]
slug: dev-shm-docker
--- 

## /dev/shm 是干嘛的？

Linux下一切皆文件。GPU、硬盘、扫描仪、鼠标等都以文件或目录的形式，呈现在Linux的`/dev`下。比如服务器中第一块NVIDIA的GPU是`/dev/nvidia0`；某块硬盘是`/dev/sda`等。

`/dev/shm`是一个特殊的目录，它表示是一块共享内存（Share Memory）。这个目录可以用来在进程间进行数据的通信和共享。比如，第一个进程创建一块内存区域，另外一个进程去访问该内存区域，两个进程之间可以快速分享数据和信息。`/dev/shm`使用了tmpfs，tmpfs是Linux上基于内存的文件系统，可以达到内存级别的读写速度。

`/dev/shm`的性质决定了，它可以用于高性能IPC（Inter-process communication
）。很多高性能场景计算应用会使用这几个函数操作这块内存区域。

在Linux中，如果想要使用`/dev/shm`，可以用以下几个方法：

```c
int shm_open(const char *name, int oflag, mode_t mode);
void *mmap(void *addr, size_t length, int prot, int flags,int fd, off_t offset);
int munmap(void *addr, size_t length);
int shm_unlink(const char *name);
int ftruncate(int fd, off_t length);
```

默认情况下，`/dev/shm`的大小是服务器大小的一半。

## docker

对于Docker容器，情况却不一样了！默认情况下，Docker容器启动后`/dev/shm`只有64M！

前段时间，在使用Docker部署GitLab时，发现GitLab Docker中的监控模块Prometheus会对`/dev/shm`进行操作，调用了前面所提到的`mmap()`等方法。而Metrics监控数据越来越大，很快就将Docker默认自带的64M写满，于是就产生了大量报错日志。GitLab服务以约每分钟20M的速度生成日志，没过几天就将服务器的硬盘写爆，直接导致服务器宕机。

查看生成的日志，发现了日志中不断出现`mmap()`的字样，这才知道，原来是出现了报错。

解决方案是：或者在Docker GitLab中关掉Prometheus的Metrics，或者增大Docker容器的`/dev/shm`目录。

如果想增大Docker的`/dev/shm`目录大小，需要在启动容器时加上`--shm-size`参数，设置这块内存大小，比如

```bash
docker run --shm-size 1024M ...
```

比如，网上就有文章发现，因为Docker默认的`/dev/shm`过小，导致PyTorch等机器学习训练崩溃。

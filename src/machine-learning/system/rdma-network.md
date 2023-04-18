---
title: RDMA高速网络与集合通讯
order: 1
head:
  - - meta
    - name: keywords
      content: 神经网络, 深度学习, 大模型, InfiniBand, RDMA, NCCL, MPI
description: "大模型训练之高速网络"
category: [深度学习]
tag: [InfiniBand, NCCL, 大模型训练]
article: false
---

很少有人深入分析其中的一个关键技术：网络。这篇文章带大家认识一下大模型训练的高速网络。

## RDMA

**Remote Direct Memory Access (RDMA)** 是一种超高速的网络内存访问技术，它允许程序以极快速度访问远程计算节点的内存。速度快的原因如下图所示，一次网络访问，不需要经过操作系统的内核（Sockets、TCP/IP等），这些操作系统内核操作都会耗费CPU时间。RDMA直接越过了这些操作系统内核开销，直接访问到网卡（Network Interface Card，NIC）。

![](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-traditional-vs-rdma.png)

RDMA的硬件主要有三种实现：InfiniBand、RoCE和iWARP。据我了解，InfiniBand和RoCE是目前比较主流的技术。

## InfiniBand：无限带宽

从名字可以看出，InfiniBand要达到无限带宽，名字听起来牛逼哄哄。实际上，也确实很牛逼。InfiniBand来自一家以色列公司：Mellanox，这家公司在2020年以69亿美元卖给了NVIDIA，被老黄收入旗下。

![Mellanox](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-Mellanox_Technologies_logo.svg.png)

InfiniBand目前主流的技术是100G、200G。人家起了一些很极客的名字，Enhanced Data Rate（EDR，100G）High Data Rate (HDR，200G)。

绝大多数IT从业者可能很少接触到InfiniBand，因为这个技术很贵，大家舍不得买。但在各大高校和科研院所的超算中心，InfiniBand几乎标配，它支撑着非常关键的超级计算任务。有多贵呢？一条InfiniBand 10米网线，大概长下面这样，大概1w人民币；网线的两端要配网卡，两头的网卡一块6k人民币，2块就是1.2w，那一根网线加上两端的网卡就是2w块钱。

![InfiniBand软线](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-nvidia-mellanox-infiniband.jpeg)

下图是1G以太网线与InfiniBand交换机对比图，上面是1G以太网线，下面是HDR交换机。

![以太网与InfiniBand](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-ib.jpg)

这还没结束，InfiniBand的组网成本也极高。InfiniBand组网跟普通的交换机还不太一样，如果希望这个网络中任何两个计算节点的网卡之间互相无损地通信，需要使用一种叫做胖树（Fat Tree）的网络拓扑，大概是如下一种拓扑结构，方块是交换机，椭圆是计算节点。胖树主要有两层，上面一层是核心层，不连任何计算节点，它的功能就是转发流量；下面一层是接入层，接入各类计算节点。胖树拓扑成本高的主要原因是：某一个汇聚交换机上，假如有36个口，那如果为了达到无损速率，一半的口，也就是18个口可以给计算节点连，剩下一半要连到上层的核心交换机上。要知道，任何一根线，就是1万多块钱呢，如果达到无损，就要冗余地做这些连接。

![胖树拓扑](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-fat-tree-topology.png)

说了这么多成本，再来说性能。贵的就是好的；好的就是贵的。InfiniBand确实能够达到极高的带宽和极低的延迟。据维基百科，InfiniBand对比以太网，延迟分别是100纳秒和230纳秒。老黄家训练大模型，都是用的InfiniBand。

## RoCE

相比InfiniBand这种爱马仕，RoCE是另外一种稍微便宜一点的选项，但也便宜不到哪儿去。**RDMA over Converged Ethernet** (**RoCE**)，主要在以太网上提供RDMA。近些年来发展很快，因为InfiniBand太贵了，大家需要一个替代品。

目前来说，华为在力推RoCE，但如果也要做无损网络，整个网络成本也很难控制在InfiniBand的50%以下。

## MPI&NCCL

前面聊完了硬件，再聊聊软件。在这些高速网络上编程，有几个常用的方案，最通用的可能是MPI（Message Passing Interface），然后就是深度学习训练所需要的NCCL（NVIDIA Collective Communication Library）。

MPI是经典的并行计算接口，主要有OpenMPI和Intel MPI几个实现，可以达到节点间通信的需求。一般情况下，在计算节点上安装了InfiniBand驱动，安装了OpenMPI/Intel MPI之后，一些高性能的计算流量会走InfiniBand网络。

NCCL是16年左右开始的一个项目，已经有了MPI，NVIDIA还要造一个轮子，因为MPI并不是做深度学习的，MPI是一个通用的框架。NCCL试图解决深度学习训练中特有的通讯问题。

NCCL主要实现了以下几个通信原语：

- AllReduce
- Broadcast
- Reduce
- AllGather
- ReduceScatter

说白了，就是提供了一个接口，用户不需要知道哪些节点的如何相互之间通信，只需要调用接口，就可以实现GPU之间的通信。

NCCL的接口比较底层，大多数搞深度学习上层应用的人不需要太深入了解，它主要给深度学习框架来用，深度学习框架PyTorch、MindSpore等等都是调用NCCL来进行GPU上的集合通讯的。搞应用的人只需要配置一个环境变量：`NCCL_SOCKET_IFNAME`，比如 `export NCCL_SOCKET_IFNAME=ib0`，其中`ib0`是InfiniBand网卡的名字，这个网卡的名字可以通过`ifconfig`或者`ip a`看到。

下面是一个最经典的 DataParallel 模式，NCCL提供Allreduce原语，把不同GPU上的梯度同步一下。

![DataParallel Allreduce](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-nccl-allreduce.png)

下面是微软 [DeepSpeed Infinity](https://www.microsoft.com/en-us/research/blog/zero-infinity-and-deepspeed-unlocking-unprecedented-model-scale-for-deep-learning-training/) 的架构，核心的网络在 InfiniBand 上，训练在GPU上，部分参数转移到 CPU 和 NVMe上。

![DeepSpeed Infinity](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-deepspeed-infinity.png)

我们可以了解一下NCCL的原理。NCCL主要做几件事：探测计算节点的网络设备和拓扑结构，使用算法自动调优选择一个最优的通信方式。

![NCCL主要工作](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-nccl.png)

为什么要做拓扑探测？因为每个计算节点的设备情况差异比较大，每个计算节点可能有自己特定的网卡NIC，可能是InfiniBand也可能是RoCE，每个计算节点上的GPU可能是NVLink，也可能是PCI-E。为了达到最优的传输效率，NCCL先要摸清当前计算节点的网络、CPU和GPU情况。之后使用调优工具，进行调优，从众多通信方式中选择一个最优方式。

下面这张图是1台计算节点搭载了8个GPU和8张网卡，某种通信路径的演示图。

![单节点通信路径](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-gpu1.png)

下面是3台计算节点的通信示意图。

![3节点通信路径](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-gpu3.png)

## 如何配置网卡？烧钱就是了

如果要做大模型，最佳的方案是一张GPU卡配一个InfiniBand网卡，NVIDIA的DGX系统就是这么搭配的。那么一个计算节点上通常可能有9个InfiniBand网卡，其中1个给存储系统（比如Lustre），另外8个分别给8个GPU卡。这样的成本极高，只有老黄玩得起。预算有限的话，可以 1 + 1， 1 + 2，或者1 + 4。下面这张图里可以看到，8张H100搭配8张400G的InfiniBand NDR，这速度也是没谁了。

![带宽对比](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-nvidia-ib-bw.png)



![每个GPU配一个网卡是最理想的情况](http://aixingqiu-1258949597.cos.ap-beijing.myqcloud.com/2023-04-18-network-gpu.png)



参考资料：

[GTC 2023: Scaling Deep Learning Training: Fast Inter-GPU Communication with NCCL](https://www.nvidia.com/en-us/on-demand/session/gtcspring23-s51111/)

[GTC 2020: Distributed Training and Fast Inter-GPU communication with NCCL](https://developer.nvidia.com/gtc/2020/video/s21107https://developer.nvidia.com/gtc/2020/video/s21107)


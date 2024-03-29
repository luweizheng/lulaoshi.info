---
title:  "faker.js删库，开源软件的白嫖、恰饭与35岁中年危机"
date:   2022-01-15 18:00:00 
description: "从faker.js删库，谈谈开源软件的白嫖与商业模式"
category: [商业模式]
permalink: /blog/open-source-developer-payoff
---

这周，IT圈一个有意思的事情是：faker.js的开源软件库作者故意加入了恶意代码，并一气之下将代码仓库删了。这个事件一度导致所有依赖faker.js的软件出现大量异常。有人分析作者Marak的主要诉求为无法维持生计，而很多大公司白嫖其工作成果，却无任何资金支持。

## 有人鼓吹开源，另外一些人却坚持不下去了

前有ElasticSearch修改License使用权限，现有个人开发者Marak删库，可以看到，开源软件被白嫖确实是一个困境。面对巨无霸公司，小公司和个人开发者付出时间和精力，回报却寥寥无几，难以维持生存。

IT互联网圈白嫖惯了，不习惯付费。

* 大公司直接在别人写的开源软件上修修改改，放到自己的云服务里，根本不会去反过来对开源社区进行贡献。

* 个人开发者使用网络上别人开源共享出来的学习资料、开源软件，也很少想着去打赏原创作者。

我非常佩服那些开源爱好者，他们能够“靠爱发电”，在没任何收入的情况下贡献自己的时间和精力。但“靠爱发电”的商业模式是有问题的，以我自己为例，去年一直在关注Flink社区，写了不少原创教程，发到了网上，后面还整理出了一本书。当初写那些教程时，天天坐在电脑前，腰酸背痛，把眼睛都看花了。变现的方式就是那本书，而书的收入仅仅一两万块钱，远对不起自己当初投入的精力和时间。发现大家都只白嫖的事实后，索性今年我也不去写教程做分享了，反正也没有人付费支持我的这些行为，这些时间和精力还不如搞一些其他赚钱的事情。人，都是要恰饭的啊。

## “开源先锋”如何恰饭

如何通过开源恰饭呢？

紧随Marak删库之后，有机构发布了一个[“2021中国开源先锋33人”](https://segmentfault.com/a/1190000041270720)榜单。跟删库这个事情放在一起，我觉得挺有趣。从这个榜单上，我们可以了解，到底如何用“开源”来恰饭。

榜单里，共33人。

至少8人为大学或研究所等事业单位教授或领导，这部分人是从国家领工资的，不需要靠开源挣钱。开源对于这部分人，挣得是个名声。

至少10人有微软、腾讯、百度、华为、字节等大厂标签，这部分人是大厂给发工资的；剩下一部分也是中小公司的创始人、CTO或技术高层。这两部分人做开源主要目的是为了推公司的产品和架构。在大厂做开源，至少个人财政上是不需要太担心的，至少大厂短期不会倒。

剩下的一小部分人，多多少少都有点名气，是国内外大大小小的开源社区的发起人或领军人物。

没有个人开发者。

作为个人开发者，闷头勤勤恳恳搞技术，好像很难赚到钱。

所以说，想要持续地参与开源，要么有国家经费支持，要么投靠大厂。再不行，至少也要会宣传自己，开一些网课，通过流量推销自己；实在不行可以做一些外包，接接私活。个人通过开源，做一些炫酷的东西，基本上都是“靠爱发电”。

## 壁垒和35岁危机

开源，可能是造成程序员35岁危机的重要因素之一。

很早之前我就发现，计算机行业看似门槛很高，实则没有壁垒。任何背景的人，只要肯学习愿钻研，都能转到计算机行业里来，只不过转行期间会经历一些痛苦。

开源其实在帮助降低门槛。

网上大量开源免费的教程和框架，新人学一些就能摸索明白了。

各个IT公司的基础设施多半都在开源上搭的。Linux、React、MySQL、Kubernetes、Spark、PyTorch，从操作系统、前端、数据库到大数据、AI，似乎都是在开源上修修补补。那对于年轻人来说，他们总会接触最新的技术，年轻人精力更旺盛，反正公司的一些东西都基于开源做的，绝大多数程序员主要是在处理自己的业务逻辑，所以公司完全没必要养一些老人，每年招一些新人，新人有一些开源的基础，一两个月熟悉了业务逻辑，可以很快替代那些老人。

与之相反，一些传统金融行业，则是商业软件的大户。他们很少开源，所以老人是不可替代的。比如很少有计算机在校生听过COBOL这门语言，但COBOL语言可能跑着我们四大银行最最最核心的业务逻辑。银行目前的困境是，COBOL语言太老了，没有应届生去学，以至于想招都招不到COBOL程序员。

---
title: 习题 股票数据流处理
order: 5
head:
  - - meta
    - name: keywords
      content: Flink, DataStream, 股票, 数据流
description: "本节将总结如何使用Flink的DataStream API来处理股票数据流。"
category: [Flink]
article: false
---

::: tip

本教程已出版为《Flink原理与实践》，感兴趣的读者请在各大电商平台购买！

<a href="https://item.jd.com/13154364.html"> ![](https://img.shields.io/badge/JD-%E8%B4%AD%E4%B9%B0%E9%93%BE%E6%8E%A5-red) </a>
<a href="https://github.com/luweizheng/flink-tutorials">
![](https://img.shields.io/badge/GitHub-%E9%85%8D%E5%A5%97%E6%BA%90%E7%A0%81-blue)
</a>

:::

经过本章的学习，读者应该对Flink的DataStream API有了初步的认识，本节以股票价格这个场景来实践所学内容。

## 实验目的

针对具体的业务场景，学习如何定义相关数据结构，如何自定义Source，如何使用各类算子。

## 实验内容

我们虚构了一个股票交易数据集，如下所示，该数据集中有每笔股票的交易时间、价格和交易量。数据集放置在了`src/main/resource/stock`文件夹里。

```
股票代号,交易日期,交易时间（秒）,价格,交易量
US2.AAPL,20200108,093003,297.260000000,100
US2.AAPL,20200108,093003,297.270000000,100
US2.AAPL,20200108,093003,297.310000000,100
```

在[数据类型和序列化](./data-types.md)章节，我们曾介绍Flink所支持的数据结构。对于这个股票价格的业务场景，首先要做的是对该业务进行建模，读者需要设计一个`StockPrice`类，能够表征一次交易数据。这个类至少包含以下字段：

```java
/* 
 * symbol      股票代号
 * ts          时间戳
 * price       价格
 * volume      交易量
 */
```

接下来，我们自定义Source，这个自定义的类继承`SourceFunction`，读取数据集中的元素，并将数据写入`DataStream<StockPrice>`中。为了模拟不同交易之间的时间间隔，我们使用`Thread.sleep()`方法，等待一定的时间。下面的代码展示了如何自定义Source，读者可以直接拿来借鉴。

```java
public class StockSource implements SourceFunction<StockPrice> {

    // Source是否正在运行
    private boolean isRunning = true;
    // 数据集文件名
    private String path;
    private InputStream streamSource;

    public StockSource(String path) {
        this.path = path;
    }

    // 读取数据集中的元素，每隔时间发送一次股票数据
  	// 使用SourceContext.collect(T element)发送数据
    @Override
    public void run(SourceContext<StockPrice> sourceContext) throws Exception {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");
        // 从项目的resources目录获取输入
        streamSource = this.getClass().getClassLoader().getResourceAsStream(path);
        BufferedReader br = new BufferedReader(new InputStreamReader(streamSource));
        String line;
        boolean isFirstLine = true;
        long timeDiff = 0;
        long lastEventTs = 0;
        while (isRunning && (line = br.readLine()) != null) {
            String[] itemStrArr = line.split(",");
            LocalDateTime dateTime = LocalDateTime.parse(itemStrArr[1] + " " + itemStrArr[2], formatter);
            long eventTs = Timestamp.valueOf(dateTime).getTime();
            if (isFirstLine) {
                // 从第一行数据提取时间戳
                lastEventTs = eventTs;
                isFirstLine = false;
            }
            StockPrice stock = StockPrice.of(itemStrArr[0], Double.parseDouble(itemStrArr[3]), eventTs, Integer.parseInt(itemStrArr[4]));
            // 输入文件中的时间戳是从小到大排列的
            // 新读入的行如果比上一行大，sleep，这样来模拟一个有时间间隔的输入流
            timeDiff = eventTs - lastEventTs;
            if (timeDiff > 0)
                Thread.sleep(timeDiff);
            sourceContext.collect(stock);
            lastEventTs = eventTs;
        }
    }

    // 停止发送数据
    @Override
    public void cancel() {
        try {
            streamSource.close();
        } catch (Exception e) {
            System.out.println(e.toString());
        }
        isRunning = false;
    }
}
```

对于我们自定义的这个Source，我们可以使用下面的时间语义：

```java
env.setStreamTimeCharacteristic(TimeCharacteristic.ProcessingTime)
```

接下来，基于DataStream API，按照股票代号分组，对股票数据流进行分析和处理。

## 实验要求

完成数据结构定义和数据流处理部分的代码编写。其中数据流分析处理部分需要完成：

* 程序1：价格最大值

实时计算某支股票的价格最大值。

* 程序2：汇率转换

数据中股票价格以美元结算，假设美元和人民币的汇率为7，使用`map`进行汇率转换，折算成人民币。

* 程序3：大额交易过滤

数据集中有交易量字段，给定某个阈值，过滤出交易量大于该阈值的，生成一个大额交易数据流。

## 实验报告

将思路和程序撰写成实验报告。
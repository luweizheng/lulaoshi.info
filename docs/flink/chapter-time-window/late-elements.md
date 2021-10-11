---
title: 处理迟到数据
keywords: 
  - Flink
  - DataStream
  - ProcessFunction
description: "本节将介绍如何处理迟到数据。"

chapter-name: 时间和窗口
chapter-url: /flink/chapter-time-window/index.html
---

import { Typography, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

<Grid container className="upper-note" spacing={1} direction="row" justifyContent="center" alignItems="center">
    <Grid item md={1} lg={1} />
    <Grid item xs={3} md={2} lg={2}>
        <img src="/img/flink-book.jpeg" /> 
    </Grid>
    <Grid item xs={8} md={8} lg={8}>
        本教程已出版为《Flink原理与实践》，感兴趣的读者请在各大电商平台购买，谢谢支持！
        配套源码👉<a target="_blank" href="https://github.com/luweizheng/flink-tutorials"><FontAwesomeIcon icon={faGithub} size={"1x"} /></a>
    </Grid>
    <Grid item md={2} lg={2} />
</Grid>

Event Time语义下我们使用Watermark来判断数据是否迟到。一个迟到元素是指元素到达窗口算子时，该元素本该被分配到某个窗口，但由于延迟，窗口已经触发计算。目前Flink有三种处理迟到数据的方式：

* 直接将迟到数据丢弃
* 将迟到数据发送到另一个流
* 重新执行一次计算，将迟到数据考虑进来，更新计算结果

## 将迟到数据丢弃

如果不做其他操作，默认情况下迟到数据会被直接丢弃。

## 将迟到数据发送到另外一个流

如果想对这些迟到数据处理，我们可以使用[ProcessFunction](./process-function.md)系列函数的侧输出功能，将迟到数据发到某个特定的流上。后续我们可以根据业务逻辑的要求，对迟到的数据流进行处理。

```scala
final OutputTag<T> lateOutputTag = new OutputTag<T>("late-data"){};

DataStream<T> input = ...

SingleOutputStreamOperator<T> result = input
    .keyBy(<key selector>)
    .window(<window assigner>)
    .allowedLateness(<time>)
    .sideOutputLateData(lateOutputTag)
    .<windowed transformation>(<window function>);

DataStream<T> lateStream = result.getSideOutput(lateOutputTag);
```

上面的代码将迟到的内容写进名为“late-data”的`OutputTag`下，之后使用`getSideOutput`获取这些迟到的数据。

## 更新计算结果

对于迟到数据，使用上面两种方法，都对计算结果的正确性有影响。如果将数据流发送到单独的侧输出，我们仍然需要完成单独的处理逻辑，相对比较复杂。更理想的情况是，将迟到数据重新进行一次，得到一个更新的结果。
`allowedLateness()`允许用户先得到一个结果，如果在一定时间内有迟到数据，迟到数据会和之前的数据一起重新被计算，以得到一个更准确的结果。使用这个功能时需要注意，原来窗口中的状态数据在窗口已经触发的情况下仍然会被保留，否则迟到数据到来后也无法与之前数据融合。另一方面，更新的结果要以一种合适的形式输出到外部系统，或者将原来结果覆盖，或者多份数据同时保存，且每份数据都有时间戳。比如，我们的计算结果是一个键值对（Key-Value），我们可以把这个结果输出到Redis这样的KV数据库中，使用某些Reids命令，同一个Key下，旧的结果会被新的结果所覆盖。

`allowedLateness()`的参数是一个整数值，表示要等待多长时间。如果不明确调用`allowedLateness()`方法，`allowedLateness()`默认的参数是0。

:::info
这个功能只针对Event Time，如果对一个Processing Time下的程序使用`allowedLateness()`，将引发异常。
:::

```java
/**
  * ProcessWindowFunction接收的泛型参数分别为：[输入类型、输出类型、Key、Window]
  */
public static class AllowedLatenessFunction extends ProcessWindowFunction<Tuple3<String, Long, Integer>, Tuple4<String, String, Integer, String>, String, TimeWindow> {
    @Override
    public void process(String key,
                        Context context,
                        Iterable<Tuple3<String, Long, Integer>> elements,
                        Collector<Tuple4<String, String, Integer, String>> out) throws Exception {
        ValueState<Boolean> isUpdated = context.windowState().getState(
          new ValueStateDescriptor<Boolean>("isUpdated", Types.BOOLEAN));

        int count = 0;
        for (Object i : elements) {
          	count++;
        }

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        if (null == isUpdated.value() || isUpdated.value() == false) {
            // 第一次使用process函数时， Boolean默认初始化为false，因此窗口函数第一次被调用时会进入这里
            out.collect(Tuple4.of(key, format.format(Calendar.getInstance().getTime()), count, "first"));
          	isUpdated.update(true);
        } else {
            // 之后isUpdated被置为true，窗口函数因迟到数据被调用时会进入这里
            out.collect(Tuple4.of(key, format.format(Calendar.getInstance().getTime()), count, "updated"));
        }
    }
}

// 使用EventTime时间语义
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);

// 数据流有三个字段：（key, 时间戳, 数值）
DataStream<Tuple3<String, Long, Integer>> input = ...

DataStream<Tuple4<String, String, Integer, String>> allowedLatenessStream = input
  		.keyBy(item -> item.f0)
      .timeWindow(Time.seconds(5))
      .allowedLateness(Time.seconds(5))
      .process(new AllowedLatenessFunction());
```

在上面的代码中，我们设置的窗口为5秒，5秒结束后，窗口计算会被触发，生成第一个计算结果。`allowedLateness()`设置窗口结束后还要等待长为lateness的时间，某个迟到元素的Event Time大于窗口结束时间但是小于窗口结束时间+lateness，该元素仍然会被加入到该窗口中。每新到一个迟到数据，迟到数据被加入`ProcessWindowFunction`的缓存中，窗口的Trigger会触发一次FIRE，窗口函数被重新调用一次，计算结果得到一次更新。

:::info
会话窗口依赖Session Gap来切分窗口，使用了`allowedLateness()`可能会导致两个窗口合并成一个窗口。
:::
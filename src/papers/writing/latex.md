---
title: LaTex
order: 1
head:
  - - meta
    - name: keywords
      content: LaTex, 论文写作
description: ""
category: [LaTex, 论文写作]
article: false
---

## 段落

对每一段创建单独的文件，例如 `intro.tex`，然后在主文件中使用 `\input{intro}` 引用。

* `\section{}`: 一级标题
* `\subsection{}`: 二级标题
* `\paragraph{}`：三级标题

## 高亮和加粗

* `\textbf{}`: 加粗

## 表格

使用 [Tables Generator](https://tablesgenerator.com/) 生成。

## 图片排版

```latex
\begin{table}[htbp]
    \begin{tabular}{column specification}
        ... table goes in here ...
    \end{tablular}
    \caption{\label{table}This is a table.}
\end{table}

\begin{figure}[htbp]
    \includegraphics[specifications]{file.eps}
    \caption{\label{figure}This is figure.}
\end{figure}
```

`[htbp]` 控制着图片或者表格的位置。

| 缩写       	| 位置         	|
|------------	|--------------	|
| b (Bottom) 	| 当前页最下方 	|
| h (Here)   	| 当前位置     	|
| p (Page)   	| 下一页开头   	|
| t (Top)    	| 当前页开头   	|

## 列表

### 无序列表
```latex
\begin{itemize}
\item The word ``data'' is plural, not singular.
\end{itemize}
```

## 文章内引用

定义 `\label{aa}` ，其他位置引用时使用 `\ref{aa}` 引用。

## 公式

```latex
\begin{equation}
a+b=\gamma\label{eq}
\end{equation}
```
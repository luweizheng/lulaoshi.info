---
layout: splash
permalink: /
hidden: true
header:
  overlay_color: "#5e616c"
  overlay_image: /assets/img/home-page-feature.png
excerpt: "高性能计算、大数据和机器学习。"
feature_row:
  - # image_path: /assets/img/mm-customizable-feature.png
    alt: "customizable"
    title: "Flink教程"
    excerpt: "《Flink原理与实践》在线免费版，详细介绍了如何在Flink上对数据流进行有状态的计算..."
    url: "/flink/"
    btn_class: "btn--primary"
    btn_label: "了解更多"
  - # image_path: /assets/img/mm-responsive-feature.png
    alt: "fully responsive"
    title: "机器学习笔记"
    excerpt: "从线性模型到深度学习，从公式原理到工程实践，兼容PyTorch和TensorFlow..."
    url: "/machine-learning/"
    btn_class: "btn--primary"
    btn_label: "了解更多"
  - # image_path: /assets/img/mm-free-feature.png
    alt: "100% free"
    title: "GPU教程"
    excerpt: "GPU快速入门教程，GPU底层原理和Python Numba上手实践..."
    url: "/gpu/"
    btn_class: "btn--primary"
    btn_label: "了解更多"     
---

{% include feature_row %}

## 最新文章

{% assign entries_layout = page.entries_layout | default: 'list' %}
{% assign postsByYear = site.posts | where_exp: "item", "item.hidden != true" | group_by_exp: 'post', 'post.date | date: "%Y"' %}
{% for year in postsByYear %}
  <section id="{{ year.name }}" class="taxonomy__section">
    <h2 class="archive__subtitle">{{ year.name }}</h2>
    <div class="entries-{{ entries_layout }}">
      {% for post in year.items %}
        {% include archive-single.html type=entries_layout %}
      {% endfor %}
    </div>
    <a href="#page-title" class="back-to-top">{{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }} &uarr;</a>
  </section>
{% endfor %}

import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: (
      <Translate id="homepage.features.flink.title">
        实时大数据计算引擎 Flink 教程
      </Translate>
    ),
    description: (
      <>
        <Translate id="homepage.features.flink.desc">
          《Flink原理与实践》在线免费版，手把手教你如何在Flink上对数据流进行有状态的计算...
        </Translate>
      </>
    ),
    emoji: "📈",
    link: "flink/intro",
    cta: (
      <Translate id="homepage.features.flink.link">前往 Flink 教程</Translate>
    ),
  },
  {
    title: <Translate id="homepage.features.ml.title">机器学习笔记</Translate>,
    description: (
      <>
        <Translate id="homepage.features.ml.desc">
          深入浅出介绍机器学习背后的原理，让公式能够看懂，让概念落地到PyTorch和NumPy实现...
        </Translate>
      </>
    ),
    emoji: "✍️",
    link: "machine-learning/intro",
    cta: (
      <Translate id="homepage.features.ml.link">前往 机器学习笔记</Translate>
    ),
  },
  {
    title: <Translate id="homepage.features.gpu.title">GPU编程入门</Translate>,
    description: (
      <>
        <Translate id="homepage.features.gpu.desc">
          GPU快速入门教程，GPU底层原理和Python Numba上手实践...
        </Translate>
      </>
    ),
    emoji: "💡",
    link: "gpu/intro",
    cta: <Translate id="homepage.features.gpu.link">前往 GPU 教程</Translate>,
  },
];

function Feature({ title, description, emoji, link, cta }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <span className="feature-emoji">{emoji}</span>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--md" to={link}>
            {cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={`${styles.features} features`}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

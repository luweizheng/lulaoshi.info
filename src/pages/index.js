import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HomepageFeatures from "../components/HomepageFeatures";
import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWeixin,
  faZhihu,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <svg width="80" height="80">
          <image
            xlinkHref={useBaseUrl("img/avatar.svg")}
            src={useBaseUrl("img/avatar.svg")}
            width="80"
            height="80"
          />
        </svg>
        <h1 className="hero__title">
          <Translate id="homepage.hello" description="hello! I'm">
            你好，我是
          </Translate>
          {siteConfig.title}
        </h1>
        <p className="hero__subtitle">
          <Translate
            id="homepage.introduction"
            description="a brief introduction of myself">
            我是一个关注数据科学和人工智能领域的研究者，我写了一些大数据和机器学习方面的原创教程和技术文章。
          </Translate>
        </p>
        <div className="hero__subtitle">
          <Translate id="homepage.social.media" description="social medias">
            在以下社交媒体上找到我：
          </Translate>
          <a href={siteConfig.customFields.weixin}>
            <FontAwesomeIcon
              icon={faWeixin}
              size="md"
              style={{ paddingRight: "0.6rem" }}
            />
          </a>
          <a href={siteConfig.customFields.zhihu}>
            <FontAwesomeIcon
              icon={faZhihu}
              size="md"
              style={{ paddingRight: "0.6rem" }}
            />
          </a>
          <a href={siteConfig.customFields.github}>
            <FontAwesomeIcon icon={faGithub} size="sm" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Tech Blog of Weizheng, mainly focusing on data science and artifical intelligence.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

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
          {/* <a href={siteConfig.customFields.weixin}>
            <FontAwesomeIcon
              icon={faWeixin}
              size="1x"
              style={{ paddingRight: "0.6rem" }}
            />
          </a>
          <a href={siteConfig.customFields.zhihu}>
            <FontAwesomeIcon
              icon={faZhihu}
              size="1x"
              style={{ paddingRight: "0.6rem" }}
            />
          </a>
          <a href={siteConfig.customFields.github}>
            <FontAwesomeIcon icon={faGithub} size="1x" />
          </a> */}

          <a
            target="_blank"
            rel="noopener noreferrer"
            href={siteConfig.customFields.weixin}>
            <svg
              role="img"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="weixin"
              className="svg-inline--fontawesome"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512">
              <path d="M385.2 167.6c6.4 0 12.6.3 18.8 1.1C387.4 90.3 303.3 32 207.7 32 100.5 32 13 104.8 13 197.4c0 53.4 29.3 97.5 77.9 131.6l-19.3 58.6 68-34.1c24.4 4.8 43.8 9.7 68.2 9.7 6.2 0 12.1-.3 18.3-.8-4-12.9-6.2-26.6-6.2-40.8-.1-84.9 72.9-154 165.3-154zm-104.5-52.9c14.5 0 24.2 9.7 24.2 24.4 0 14.5-9.7 24.2-24.2 24.2-14.8 0-29.3-9.7-29.3-24.2.1-14.7 14.6-24.4 29.3-24.4zm-136.4 48.6c-14.5 0-29.3-9.7-29.3-24.2 0-14.8 14.8-24.4 29.3-24.4 14.8 0 24.4 9.7 24.4 24.4 0 14.6-9.6 24.2-24.4 24.2zM563 319.4c0-77.9-77.9-141.3-165.4-141.3-92.7 0-165.4 63.4-165.4 141.3S305 460.7 397.6 460.7c19.3 0 38.9-5.1 58.6-9.9l53.4 29.3-14.8-48.6C534 402.1 563 363.2 563 319.4zm-219.1-24.5c-9.7 0-19.3-9.7-19.3-19.6 0-9.7 9.7-19.3 19.3-19.3 14.8 0 24.4 9.7 24.4 19.3 0 10-9.7 19.6-24.4 19.6zm107.1 0c-9.7 0-19.3-9.7-19.3-19.6 0-9.7 9.7-19.3 19.3-19.3 14.5 0 24.4 9.7 24.4 19.3.1 10-9.9 19.6-24.4 19.6z" />
            </svg>
          </a>

          <a
            target="_blank"
            rel="noopener noreferrer"
            href={siteConfig.customFields.zhihu}>
            <svg
              role="img"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="zhihu"
              className="svg-inline--fontawesome"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512">
              <path d="M170.54 148.13v217.54l23.43.01 7.71 26.37 42.01-26.37h49.53V148.13H170.54zm97.75 193.93h-27.94l-27.9 17.51-5.08-17.47-11.9-.04V171.75h72.82v170.31zm-118.46-94.39H97.5c1.74-27.1 2.2-51.59 2.2-73.46h51.16s1.97-22.56-8.58-22.31h-88.5c3.49-13.12 7.87-26.66 13.12-40.67 0 0-24.07 0-32.27 21.57-3.39 8.9-13.21 43.14-30.7 78.12 5.89-.64 25.37-1.18 36.84-22.21 2.11-5.89 2.51-6.66 5.14-14.53h28.87c0 10.5-1.2 66.88-1.68 73.44H20.83c-11.74 0-15.56 23.62-15.56 23.62h65.58C66.45 321.1 42.83 363.12 0 396.34c20.49 5.85 40.91-.93 51-9.9 0 0 22.98-20.9 35.59-69.25l53.96 64.94s7.91-26.89-1.24-39.99c-7.58-8.92-28.06-33.06-36.79-41.81L87.9 311.95c4.36-13.98 6.99-27.55 7.87-40.67h61.65s-.09-23.62-7.59-23.62v.01zm412.02-1.6c20.83-25.64 44.98-58.57 44.98-58.57s-18.65-14.8-27.38-4.06c-6 8.15-36.83 48.2-36.83 48.2l19.23 14.43zm-150.09-59.09c-9.01-8.25-25.91 2.13-25.91 2.13s39.52 55.04 41.12 57.45l19.46-13.73s-25.67-37.61-34.66-45.86h-.01zM640 258.35c-19.78 0-130.91.93-131.06.93v-101c4.81 0 12.42-.4 22.85-1.2 40.88-2.41 70.13-4 87.77-4.81 0 0 12.22-27.19-.59-33.44-3.07-1.18-23.17 4.58-23.17 4.58s-165.22 16.49-232.36 18.05c1.6 8.82 7.62 17.08 15.78 19.55 13.31 3.48 22.69 1.7 49.15.89 24.83-1.6 43.68-2.43 56.51-2.43v99.81H351.41s2.82 22.31 25.51 22.85h107.94v70.92c0 13.97-11.19 21.99-24.48 21.12-14.08.11-26.08-1.15-41.69-1.81 1.99 3.97 6.33 14.39 19.31 21.84 9.88 4.81 16.17 6.57 26.02 6.57 29.56 0 45.67-17.28 44.89-45.31v-73.32h122.36c9.68 0 8.7-23.78 8.7-23.78l.03-.01z" />
            </svg>
          </a>

          <a
            target="_blank"
            rel="noopener noreferrer"
            href={siteConfig.customFields.github}>
            <svg
              role="img"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="github"
              className="svg-inline--fontawesome"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512">
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
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

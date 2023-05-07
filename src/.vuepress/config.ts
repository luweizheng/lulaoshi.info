import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import { redirectPlugin } from "vuepress-plugin-redirect";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "鲁老师",
    },
  },

  head: [
    ["script", { src: "https://hm.baidu.com/hm.js?c676936091a9af3267c592c7553f1f7b" }],
    ["meta", {name: "google-site-verification", content: "eHE1bxyapx0KKbqTqt5f6R4ihsMct0bgdbmhGggIEuE"}],
  ],

  theme,
  shouldPrefetch: false,

  plugins: [
    [
      docsearchPlugin({
        appId: '789I7GU9ZA',
        apiKey: 'f6ae1e3da405e6782406946fd02d1557',
        indexName: 'lulaoshi',
        locales: {
          '/': {
            placeholder: '搜索文档',
            translations: {
              button: {
                buttonText: '搜索文档',
              },
            },
          },
        },
      }),

      redirectPlugin({
        hostname: "https://lulaoshi.info",
        config: (app) =>
          Object.fromEntries(
            app.pages
              .filter(({ path }) => path.startsWith("/deep-learning/"))
              .map(({ path }) => {
                const newPath = path.replace(/^\/deep-learning\//, "/machine-learning/");
                return [
                  newPath.endsWith("/") ? `${newPath}index.html` : newPath,
                  path,
                ];
              })
          ),
      }),
    ],
  ],
});

import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
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
      searchProPlugin({
        // 索引全部内容
        indexContent: true,
        // 为分类和标签添加索引
        customFields: [
          {
            getter: (page) => page.frontmatter.category,
            formatter: "分类：$content",
          },
          {
            getter: (page) => page.frontmatter.tag,
            formatter: "标签：$content",
          },
        ],
      }),
    ],
  ],
});

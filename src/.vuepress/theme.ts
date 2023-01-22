import { hopeTheme } from "vuepress-theme-hope";
import { zhNavbar } from "./navbar/index.js";
import { zhSidebar } from "./sidebar/index.js";
import { blogPlugin } from "vuepress-plugin-blog2";

export default hopeTheme({
  hostname: "https://lulaoshi.info/",

  author: {
    name: "鲁老师",
    url: "https://luweizheng.github.io/",
  },

  iconAssets: "iconfont",

  logo: "/logo.svg",

  repo: "luweizheng/lulaoshi.info",

  fullscreen: false,

  locales: {

    /**
     * Chinese locale config
     */
    "/": {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: "<a target='_blank' href='https://beian.miit.gov.cn/'>京ICP备20015649号 </a> <a target='_blank' href='http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802031786' style='display:inline-block;text-decoration:none;height:20px;line-height:20px;'><img src='/assets/beian.png' alt='公安备案' style='float:left;'/>京公网安备 11010802031786号</a>",

      displayFooter: true,

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },

      blog: {
        description: "关注机器学习系统、大数据和数据管理，曾在小米、Boss直聘等互联网公司做大数据数据开发，现高校高性能计算中心技术负责人。",
        medias: {
          Email: "mailto:luweizheng36@hotmail.com",
          Wechat: "https://mp.weixin.qq.com/s/8IHwxfSecV8L8GscD9ro-A",
          Zhihu: "https://www.zhihu.com/people/steven-lu-08",
          GitHub: "https://github.com/luweizheng",
        },
      },    
    },
  },

  plugins: {
    blog: {
      excerptLength: 0,
      article: '/blog/',
      type: [
        {
          key: "post",
          filter: ({ filePathRelative, frontmatter }) => {
            // 舍弃那些不是从 Markdown 文件生成的页面
            if (!filePathRelative) return false;
    
            // 舍弃不包含`blog` 文件夹的页面
            if (!filePathRelative.includes("/blog/")) return false;
    
            // 舍弃那些没有使用默认布局的页面
            if (frontmatter.home || frontmatter.layout) return false;
    
            return true;
          },
        },
      ],
    },

    components: {
      components: [
        "Badge",
        "Catalog",
      ],

    },
    // If you don’t need comment feature, you can remove following option
    // The following config is for demo ONLY, if you need comment feature, please generate and use your own config, see comment plugin documentation for details.
    // To avoid disturbing the theme developer and consuming his resources, please DO NOT use the following config directly in your production environment!!!!!
    // comment: {
    //   /**
    //    * Using Giscus
    //    */
    //   // provider: "Giscus",
    //   // repo: "vuepress-theme-hope/giscus-discussions",
    //   // repoId: "R_kgDOG_Pt2A",
    //   // category: "Announcements",
    //   // categoryId: "DIC_kwDOG_Pt2M4COD69",

    //   /**
    //    * Using Twikoo
    //    */
    //   // provider: "Twikoo",
    //   // envId: "https://twikoo.ccknbc.vercel.app",

    //   /**
    //    * Using Waline
    //    */
    //   provider: "Waline",
    //   serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    // },

    // Disable features you don’t want here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },

    // uncomment these if you want a pwa
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});

import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  // "/": [
  //   "",
  //   {
  //     text: "GPU编程",
  //     icon: "lightbulb",
  //     prefix: "gpu/",
  //     children: [
  //       "gpu-basic/",
  //       "python-cuda/",
  //     ],
  //   },
  // ], 
  "/gpu/": "structure",
  "/deep-learning/": "structure",
  "/flink/": "structure",
  "/python/": "structure",
  // "/gpu/": [{
  //     text: "GPU基础知识",
  //     prefix: "gpu-basic/",
  //     children: "structure"
  //   }, {
  //     text: "Python CUDA",
  //     prefix: "python-cuda/",
  //     children: "structure"
  //   },
  // ],
});

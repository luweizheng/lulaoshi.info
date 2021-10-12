import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import Box from "@mui/material/Box";

export default function FlinkBook() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        bgcolor: "background.paper",
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: 1,
        fontWeight: "bold",
      }}>
      <Box
        component="img"
        sx={{
          height: 163,
          width: 116,
          maxHeight: { xs: 231, md: 325 },
          maxWidth: { xs: 325, md: 231 },
          margin: "0.5em 0",
        }}
        alt="flink book"
        src="/img/flink-book.jpeg"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          m: 3,
          minWidth: { md: 350 },
        }}>
        <Box component="span" sx={{ fontSize: 16, mt: 1 }}>
          本教程已出版为《Flink原理与实践》，感兴趣的读者请在各大电商平台购买！
        </Box>
        <Box component="span">
          配套源码👉
          <a
            target="_blank"
            href="https://github.com/luweizheng/flink-tutorials">
            <FontAwesomeIcon icon={faGithub} size={"1x"} />
          </a>
        </Box>
      </Box>
    </Box>
  );
}

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./style.module.css";

function BVideo({ src, bsrc }) {
  return (
    <>
      <iframe
        src={src}
        loading="lazy"
        scrolling="no"
        border={0}
        frameBorder="no"
        framespacing={0}
        allowFullScreen={true}
        // style={{ width: "100%", height: "500px" }}
        className={styles.videoFrame}></iframe>
    </>
  );
}

BVideo.propTypes = {
  src: PropTypes.string.isRequired,
  bsrc: PropTypes.string,
};

export default BVideo;

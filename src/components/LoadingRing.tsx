import React from "react";
import styles from "./LoadingRing.module.scss";

const LoadingRing = () => {
  return (
    <div className={styles.ring}>
      Loading
      <span></span>
    </div>
  );
};

export default LoadingRing;

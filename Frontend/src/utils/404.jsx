import React from "react";
import styles from "./404.module.css";

const Page404 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>404</div>
      <div className={styles.message}>
        Sorry, the page you requested could not be found.
      </div>
      <a className={styles.link} href="/">
        Go back to homepage
      </a>
    </div>
  );
};

export default Page404;

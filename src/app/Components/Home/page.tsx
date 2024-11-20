"use client";
import styles from "./Home.module.css";

import { useEffect } from "react";

export default function HomePage() {
  return (
    <div className={styles.homeContainer }>
      <div className={styles.homeText}>home</div>
    </div>
  );
}

"use client";

import Link from "next/link";
import styles from "./Nav.module.css"; 

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/Components/Home" className={styles.navLink}>
            Home
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/Components/Cars" className={styles.navLink}>
            Cars
          </Link>
        </li>
      </ul>
    </nav>
  );
}

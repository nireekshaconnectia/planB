import React from 'react';
import styles from './sidemenu.module.css';

export default function SideMenu() {
  return (
    <div className={styles.sideMenu}>
        <div>
            <div>Language</div>
        </div>
        <div>Menu</div>
        <div>Logout</div>
    </div>
  )
}

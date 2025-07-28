import React from 'react';
import styles from './header.module.css';
import BackButton from '../backbutton/backbutton';
export default function SecondHeader({ title="Catering" }) {
  return (
    <header className={styles.secondHeader}>
        <BackButton />
      <h1>{title}</h1>
        
    </header>
  );
}

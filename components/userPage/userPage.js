"use client";
import { useRouter } from "next/navigation"; // Import router for redirection
import BackButton from "@/components/backbutton/backbutton";
import styles from "./users.module.css";

const UserPage = ({ title, children }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageCard}>
        <div className={styles.mb4}>
          <BackButton />
        </div>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.pageContent}>{children}</div>
      </div>
    </div>
  );
};

export default UserPage;

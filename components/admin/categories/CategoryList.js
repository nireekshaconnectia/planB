"use client";
import styles from "./categoryList.module.css";
import Image from "next/image";

export default function CategoryList({ categories, onDelete, onEdit }) {
  return (
    <div className={styles.adminCategoriesList}>
      {categories.map((category) => (
        <div key={category.id} className={styles.card}>
            <div className={styles.cardContent}>
                <div className={styles.featuredImage}
            style={{
              backgroundImage: `url(${category.imageUrl})`,
            }}
          />
          <div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
            </div>
          
          <div className={styles.actions}>
              <button className={styles.editbutton} onClick={() => onEdit(category)}>Edit</button>
              <button className={styles.delButton} onClick={() => onDelete(category.id)}>Delete</button>
            </div>
        </div>
      ))}
    </div>
  );
}

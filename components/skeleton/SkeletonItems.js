import styles from "./skeleton.module.css";

export default function SkeletonItems({ categoryCount = 3, itemsPerCategory = 4 }) {
    return (
      <div className={styles.skeletonList}>
        {Array.from({ length: categoryCount }).map((_, catIdx) => (
          <div key={catIdx} className={styles.categorySection}>
            <div className={styles.skeletonTitle} />
  
            <div className={styles.foodItems}>
              {Array.from({ length: itemsPerCategory }).map((_, itemIdx) => (
                <div className={styles.skeletonItem} key={itemIdx}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.itemDetails}>
                    <div className={`${styles.skeletonText} ${styles.title}`} />
                    <div className={`${styles.skeletonText} ${styles.short}`} />
                    <div className={`${styles.skeletonText} ${styles.long}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
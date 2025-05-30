"use client";
import styles from "./categoryList.module.css";
import Image from "next/image";
import { useState } from "react";

const formatImageUrl = (url) => {
  if (url.startsWith('http')) {
    return url;
  }
  // Replace backslashes with forward slashes
  const formattedUrl = url.replace(/\\/g, '/');
  return process.env.NEXT_PUBLIC_API_UPLOADS + '/' + formattedUrl;
};

export default function CategoryList({ categories, onDelete, onEdit }) {
  const [deletingIds, setDeletingIds] = useState(new Set());

  const handleDeleteClick = async (categoryId) => {
    if (deletingIds.has(categoryId)) return; // Prevent multiple clicks
    
    try {
      setDeletingIds(prev => new Set([...prev, categoryId]));
      const success = await onDelete(categoryId);
      if (success) {
        // The parent component will handle the state update
      }
    } catch (error) {
      console.error('Error in delete operation:', error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  };

  return (
    <div className={styles.adminCategoriesList}>
      {categories.map((category) => (
        <div key={category.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div 
              className={styles.featuredImage}
              style={{
                backgroundImage: `url(${formatImageUrl(category.imageUrl)})`,
              }}
            />
            <div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button 
              className={styles.editbutton} 
              onClick={() => onEdit(category)}
            >
              Edit
            </button>
            <button 
              className={styles.delButton} 
              onClick={() => handleDeleteClick(category.id)}
              disabled={deletingIds.has(category.id)}
            >
              {deletingIds.has(category.id) ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

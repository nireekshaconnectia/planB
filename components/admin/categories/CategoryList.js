"use client";
import styles from './categoryList.module.css';

export default function CategoryList({ categories, onDelete, onEdit }) {
    return (
        <div className={styles.grid}>
            {categories.map(category => (
                <div key={category.id} className={styles.card}>
                    <img src={category.imageUrl} alt={category.name} />
                    <div>
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                        <div>
                            <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                            <span>Updated: {new Date(category.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <button onClick={() => onEdit(category)}>Edit</button>
                            <button onClick={() => onDelete(category.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

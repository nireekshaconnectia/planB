"use client";
import { useState } from 'react';
import Image from 'next/image';
import styles from './itemList.module.css';
import { useTranslations } from 'next-intl';

export default function ItemList({ items, onDelete, onEdit }) {
    const [deletingId, setDeletingId] = useState(null);
    const t = useTranslations();

    const handleDeleteClick = async (id) => {
        if (window.confirm(t('confirm-delete-item'))) {
            setDeletingId(id);
            try {
                await onDelete(id);
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (!items || items.length === 0) {
        return <div className={styles.empty}>{t('no-items')}</div>;
    }

    return (
        <div className={styles.list}>
            {items.map((item) => (
                <div key={item.id} className={styles.item}>
                    <div className={styles.imageContainer}>
                        {item.imageUrl && (
                            <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={60}
                                height={60}
                                style={{ objectFit: 'cover' }}
                            />
                        )}
                    </div>
                    <div className={styles.details}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <div className={styles.meta}>
                            <span className={styles.price}>${item.price}</span>
                            <span className={styles.category}>{item.category?.name}</span>
                            <span className={`${styles.status} ${item.isAvailable ? styles.available : styles.unavailable}`}>
                                {item.isAvailable ? t('available') : t('unavailable')}
                            </span>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button
                            onClick={() => onEdit(item)}
                            className={styles.editButton}
                        >
                            {t('edit')}
                        </button>
                        <button
                            onClick={() => handleDeleteClick(item.id)}
                            disabled={deletingId === item.id}
                            className={styles.deleteButton}
                        >
                            {deletingId === item.id ? t('deleting') : t('delete')}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
} 
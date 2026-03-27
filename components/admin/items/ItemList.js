"use client";
import { useState } from 'react';
import Image from 'next/image';
import styles from './itemList.module.css';
import { useTranslations } from 'next-intl';

export default function ItemList({ items, onDelete, onEdit }) {
    const [deletingId, setDeletingId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
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

    // Function to validate if URL is actually an image URL
    const isValidImageUrl = (url) => {
        if (!url) return false;
        try {
            new URL(url);
            // Check if URL has image extension or if it's from common image services
            const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i;
            const isImageExtension = imageExtensions.test(url.split('?')[0]);
            
            // Allow common image hosting services even without extension
            const imageHosts = [
                'images.unsplash.com',
                'cdn.pixabay.com',
                'i.imgur.com',
                'res.cloudinary.com',
                'storage.googleapis.com',
                's3.amazonaws.com'
            ];
            const urlObj = new URL(url);
            const isKnownImageHost = imageHosts.some(host => urlObj.hostname.includes(host));
            
            return isImageExtension || isKnownImageHost;
        } catch {
            return false;
        }
    };

    // Extract actual image URL from freepik page URL if needed
    const extractImageUrl = (url) => {
        if (!url) return null;
        
        // If it's a freepik page URL, we can't directly use it as image
        if (url.includes('freepik.com') && url.includes('.htm')) {
            return null; // Return null to use fallback
        }
        
        return url;
    };

    const handleImageError = (itemId) => {
        setImageErrors(prev => ({ ...prev, [itemId]: true }));
    };

    const getImageUrl = (item) => {
        // If we already know this image failed, return null
        if (imageErrors[item.id]) return null;
        
        const url = item.imageUrl || item.image;
        if (!url) return null;
        
        return extractImageUrl(url);
    };

    if (!items || items.length === 0) {
        return <div className={styles.empty}>{t('no-items')}</div>;
    }

    return (
        <div className={styles.list}>
            {items.map((item) => {
                const imageUrl = getImageUrl(item);
                const isValidImage = imageUrl && isValidImageUrl(imageUrl);
                
                return (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.imageContainer}>
                            {isValidImage ? (
                                <img
                                    src={imageUrl}
                                    alt={item.name}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }}
                                    onError={() => handleImageError(item.id)}
                                />
                            ) : (
                                <div className={styles.placeholderImage}>
                                    <span>No Image</span>
                                </div>
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
                );
            })}
        </div>
    );
}
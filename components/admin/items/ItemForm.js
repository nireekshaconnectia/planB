"use client";
import { useState, useEffect } from 'react';
import styles from './itemForm.module.css';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const formatImageUrl = (url) => {
    if (!url) return '';
    
    // Handle external URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // Check if it's a freepik page URL
        if (url.includes('freepik.com') && (url.includes('.htm') || url.includes('#'))) {
            console.warn('Invalid image URL (freepik page):', url);
            return '';
        }
        return url;
    }
    
    // Handle local paths
    const formattedUrl = url.replace(/\\/g, '/');
    const cleanUrl = formattedUrl.replace(/^\/+/, '');
    return `${process.env.NEXT_PUBLIC_API_UPLOADS}/${cleanUrl}`;
};

// Helper to validate image URL
const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
        new URL(url);
        // Check if it's a valid image URL (has image extension or from known image hosts)
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
        const imageHosts = ['images.unsplash.com', 'cdn.pixabay.com', 'i.imgur.com', 'res.cloudinary.com'];
        const urlObj = new URL(url);
        const hasImageExtension = imageExtensions.test(urlObj.pathname);
        const isKnownImageHost = imageHosts.some(host => urlObj.hostname.includes(host));
        return hasImageExtension || isKnownImageHost;
    } catch {
        return false;
    }
};

function getInitialFormData(initialData) {
    const imageUrl = initialData?.image ? formatImageUrl(initialData.image) : '';
    return {
        name: initialData?.name || '',
        nameAr: initialData?.nameAr || '',
        description: initialData?.description || '',
        descriptionAr: initialData?.descriptionAr || '',
        price: initialData?.price || '',
        categories: initialData?.categories?.map(cat => typeof cat === 'object' ? cat._id : cat) || [],
        isAvailable: initialData?.isAvailable ?? true,
        image: null,
        imageUrl: isValidImageUrl(imageUrl) ? imageUrl : '', // Store the image URL separately
        imagePreview: isValidImageUrl(imageUrl) ? imageUrl : '',
        preparationTime: initialData?.preparationTime || 5,
        imageError: false,
    };
}

export default function ItemForm({ onSave, initialData = null, onClose }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const t = useTranslations();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState(getInitialFormData(initialData));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin');
        }
    }, [status, router]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setFormData(getInitialFormData(initialData));
        
        if (initialData && initialData.id) {
            const fetchBothLanguages = async () => {
                try {
                    const [enRes, arRes] = await Promise.all([
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${initialData.id}`, {
                            headers: { 'Accept-Language': 'en', 'Authorization': `Bearer ${session?.user?.token}` }
                        }),
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${initialData.id}`, {
                            headers: { 'Accept-Language': 'ar', 'Authorization': `Bearer ${session?.user?.token}` }
                        })
                    ]);
                    const enData = await enRes.json();
                    const arData = await arRes.json();
                    if (enData.success && arData.success) {
                        setFormData(prev => ({
                            ...prev,
                            name: enData.data.name || '',
                            description: enData.data.description || '',
                            nameAr: arData.data.name || '',
                            descriptionAr: arData.data.description || '',
                        }));
                    }
                } catch (err) {
                    console.error('Error fetching both language data:', err);
                }
            };
            fetchBothLanguages();
        }
    }, [initialData, session]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setCategories(data.data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
        }
    };

    const validateImage = (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            throw new Error(t('invalid-image-type'));
        }

        if (file.size > maxSize) {
            throw new Error(t('image-size-limit'));
        }
    };

    const validateImageUrl = (url) => {
        if (!url) return true;
        
        try {
            new URL(url);
            // Check if it's a freepik page URL
            if (url.includes('freepik.com') && (url.includes('.htm') || url.includes('#'))) {
                throw new Error('Invalid image URL: Freepik page URLs are not valid image sources. Please use a direct image URL.');
            }
            return true;
        } catch {
            throw new Error('Please enter a valid image URL');
        }
    };

    const handleCategoryChange = (categoryId) => {
        setFormData(prev => {
            const currentCategories = prev.categories || [];
            const newCategories = currentCategories.includes(categoryId)
                ? currentCategories.filter(id => id !== categoryId)
                : [...currentCategories, categoryId];
            return { ...prev, categories: newCategories };
        });
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        try {
            validateImageUrl(url);
            setFormData(prev => ({
                ...prev,
                imageUrl: url,
                imagePreview: url,
                image: null, // Clear file if URL is provided
                imageError: false
            }));
            setError('');
        } catch (err) {
            setError(err.message);
            setFormData(prev => ({
                ...prev,
                imageUrl: url,
                imageError: true
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (status === 'unauthenticated') {
            router.push('/admin');
            return;
        }

        if (!session?.user?.token) {
            setError(t('no-auth-token'));
            setIsLoading(false);
            return;
        }

        try {
            // Prepare data to send
            const dataToSend = {
                name: formData.name.trim(),
                nameAr: formData.nameAr.trim(),
                description: formData.description.trim(),
                descriptionAr: formData.descriptionAr.trim(),
                price: parseFloat(formData.price),
                isAvailable: formData.isAvailable,
                categories: formData.categories,
                preparationTime: parseInt(formData.preparationTime),
            };

            // If there's an image URL (external), include it
            if (formData.imageUrl && !formData.imageError && isValidImageUrl(formData.imageUrl)) {
                dataToSend.image = formData.imageUrl;
            }

            const url = initialData 
                ? `${process.env.NEXT_PUBLIC_API_URL}/menu/${initialData.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/menu`;

            let response;
            
            // If there's a file upload, use FormData
            if (formData.image) {
                const formDataToSend = new FormData();
                Object.keys(dataToSend).forEach(key => {
                    if (key === 'categories') {
                        dataToSend[key].forEach(value => {
                            formDataToSend.append(`${key}[]`, value);
                        });
                    } else if (key !== 'image') {
                        formDataToSend.append(key, dataToSend[key]);
                    }
                });
                formDataToSend.append('image', formData.image);

                response = await fetch(url, {
                    method: initialData ? 'PUT' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.user.token}`
                    },
                    body: formDataToSend
                });
            } else {
                // Otherwise send as JSON
                response = await fetch(url, {
                    method: initialData ? 'PUT' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.user.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });
            }

            const responseData = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/admin');
                    throw new Error(t('session-expired'));
                }
                throw new Error(responseData.message || t('save-failed'));
            }

            if (responseData.success) {
                onSave();
                onClose();
                if (!initialData) {
                    setFormData({
                        name: '',
                        nameAr: '',
                        description: '',
                        descriptionAr: '',
                        price: '',
                        categories: [],
                        isAvailable: true,
                        image: null,
                        imageUrl: '',
                        imagePreview: '',
                        preparationTime: 5,
                        imageError: false,
                    });
                }
            } else {
                throw new Error(responseData.message || t('save-failed'));
            }
        } catch (error) {
            console.error('Error saving menu item:', error);
            setError(error.message || t('save-failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.fieldGroup}>
                <label>{t('item-name-en') || 'Item Name (English)'}</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('enter-item-name-en') || 'Enter item name in English'}
                    required
                />
            </div>
            
            <div className={styles.fieldGroup}>
                <label>{t('item-name-ar') || 'Item Name (Arabic)'}</label>
                <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder={t('enter-item-name-ar') || 'Enter item name in Arabic'}
                    required
                />
            </div>
            
            <div className={styles.fieldGroup}>
                <label>{t('description-en') || 'Description (English)'}</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('enter-description-en') || 'Enter description in English'}
                    required
                />
            </div>
            
            <div className={styles.fieldGroup}>
                <label>{t('description-ar') || 'Description (Arabic)'}</label>
                <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder={t('enter-description-ar') || 'Enter description in Arabic'}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>{t('price')}</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder={t('enter-price')}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>{t('category')}</label>
                <div className={styles.categoryList}>
                    {categories.map((category) => (
                        <div key={category._id} className={styles.categoryItem}>
                            <input
                                type="checkbox"
                                id={`category-${category._id}`}
                                checked={formData.categories.includes(category._id)}
                                onChange={() => handleCategoryChange(category._id)}
                            />
                            <label htmlFor={`category-${category._id}`}>
                                {category.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.fieldGroup}>
                <label>Preparation Time (minutes)</label>
                <input
                    type="number"
                    min="1"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>{t('availability')}</label>
                <div className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    />
                    <span>{t('item-available')}</span>
                </div>
            </div>

            <div className={styles.fieldGroup}>
                <label>Image URL (optional)</label>
                <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                />
                <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                    Enter a direct image URL (e.g., from Unsplash, Imgur, or your own server)
                </small>
            </div>

            <div className={styles.fieldGroup}>
                <label>Or Upload Image File</label>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            try {
                                validateImage(file);
                                setFormData(prev => ({
                                    ...prev,
                                    image: file,
                                    imageUrl: '', // Clear URL if file is uploaded
                                    imagePreview: URL.createObjectURL(file),
                                    imageError: false
                                }));
                                setError('');
                            } catch (error) {
                                setError(error.message);
                            }
                        }
                    }}
                />
                {formData.imagePreview && !formData.imageError && (
                    <div className={styles.imagePreview}>
                        <img 
                            src={formData.imagePreview} 
                            alt="Preview" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={() => setFormData(prev => ({ ...prev, imageError: true }))}
                        />
                    </div>
                )}
            </div>

            <div className={styles.buttonGroup}>
                <button 
                    type="button"
                    onClick={onClose}
                    className={styles.cancelButton}
                >
                    {t('cancel')}
                </button>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? t('saving') : (initialData ? t('update') : t('create'))}
                </button>
            </div>
        </form>
    );
}
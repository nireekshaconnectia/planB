"use client";
import { useState, useEffect } from 'react';
import styles from './itemForm.module.css';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const formatImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) {
        return url;
    }
    const formattedUrl = url.replace(/\\/g, '/');
    const cleanUrl = formattedUrl.replace(/^\/+/, '');
    return `${process.env.NEXT_PUBLIC_API_UPLOADS}/${cleanUrl}`;
};

function getInitialFormData(initialData) {
    return {
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        categories: initialData?.categories?.map(cat => typeof cat === 'object' ? cat._id : cat) || [],
        isAvailable: initialData?.isAvailable ?? true,
        image: null,
        imagePreview: initialData?.image ? formatImageUrl(initialData.image) : '',
        nutritionalInfo: initialData?.nutritionalInfo || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        },
        preparationTime: initialData?.preparationTime || 5,
        ingredients: initialData?.ingredients || []
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
    const [ingredientInput, setIngredientInput] = useState('');

    useEffect(() => {
        // Log initial data for debugging
        console.log('Initial Data:', initialData);
        console.log('Form Data:', formData);
    }, [initialData]);

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
    }, [initialData]);

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
                // Log categories for debugging
                console.log('Fetched Categories:', data.data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
        }
    };

    const validateImage = (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            throw new Error(t('invalid-image-type'));
        }

        if (file.size > maxSize) {
            throw new Error(t('image-size-limit'));
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

    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ingredientInput.trim()]
            }));
            setIngredientInput('');
        }
    };

    const handleRemoveIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
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
            // Create a plain object instead of FormData
            const dataToSend = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                isAvailable: formData.isAvailable,
                categories: formData.categories,
                preparationTime: parseInt(formData.preparationTime),
                ingredients: formData.ingredients,
                nutritionalInfo: {
                    calories: parseInt(formData.nutritionalInfo.calories) || 0,
                    protein: parseInt(formData.nutritionalInfo.protein) || 0,
                    carbs: parseInt(formData.nutritionalInfo.carbs) || 0,
                    fat: parseInt(formData.nutritionalInfo.fat) || 0
                }
            };

            // If there's a new image, use FormData
            if (formData.image) {
                const formDataToSend = new FormData();
                Object.keys(dataToSend).forEach(key => {
                    if (key === 'categories' || key === 'ingredients') {
                        dataToSend[key].forEach(value => {
                            formDataToSend.append(`${key}[]`, value);
                        });
                    } else if (key === 'nutritionalInfo') {
                        Object.keys(dataToSend[key]).forEach(nutKey => {
                            formDataToSend.append(`nutritionalInfo[${nutKey}]`, dataToSend[key][nutKey]);
                        });
                    } else {
                        formDataToSend.append(key, dataToSend[key]);
                    }
                });
                formDataToSend.append('image', formData.image);

                const url = initialData 
                    ? `${process.env.NEXT_PUBLIC_API_URL}/menu/${initialData.id}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/menu`;

                console.log('Submitting to URL:', url);
                console.log('Form data:', Object.fromEntries(formDataToSend));

                const response = await fetch(url, {
                    method: initialData ? 'PUT' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.user.token}`
                    },
                    body: formDataToSend
                });

                console.log('Response status:', response.status);
                const responseData = await response.json();
                console.log('Response data:', responseData);

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
                            description: '',
                            price: '',
                            categories: [],
                            isAvailable: true,
                            image: null,
                            imagePreview: '',
                            nutritionalInfo: {
                                calories: 0,
                                protein: 0,
                                carbs: 0,
                                fat: 0
                            },
                            preparationTime: 5,
                            ingredients: []
                        });
                    }
                } else {
                    throw new Error(responseData.message || t('save-failed'));
                }
            } else {
                // If no new image, send as JSON
                const url = initialData 
                    ? `${process.env.NEXT_PUBLIC_API_URL}/menu/${initialData.id}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/menu`;

                console.log('Submitting to URL:', url);
                console.log('Request data:', dataToSend);

                const response = await fetch(url, {
                    method: initialData ? 'PUT' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.user.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });

                console.log('Response status:', response.status);
                const responseData = await response.json();
                console.log('Response data:', responseData);

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
                            description: '',
                            price: '',
                            categories: [],
                            isAvailable: true,
                            image: null,
                            imagePreview: '',
                            nutritionalInfo: {
                                calories: 0,
                                protein: 0,
                                carbs: 0,
                                fat: 0
                            },
                            preparationTime: 5,
                            ingredients: []
                        });
                    }
                } else {
                    throw new Error(responseData.message || t('save-failed'));
                }
            }
        } catch (error) {
            console.error('Error saving menu item:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            setError(error.message || t('save-failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.fieldGroup}>
                <label>{t('item-name')}</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('enter-item-name')}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>{t('description')}</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('enter-description')}
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
                <label>Ingredients</label>
                <div className={styles.ingredientsList}>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className={styles.ingredientItem}>
                            <span>{ingredient}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className={styles.removeButton}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.ingredientInput}>
                    <input
                        type="text"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        placeholder="Add an ingredient"
                    />
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className={styles.addButton}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className={styles.fieldGroup}>
                <label>Nutritional Information</label>
                <div className={styles.nutritionalInfo}>
                    <div>
                        <label>Calories</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.nutritionalInfo.calories}
                            onChange={(e) => setFormData({
                                ...formData,
                                nutritionalInfo: {
                                    ...formData.nutritionalInfo,
                                    calories: parseInt(e.target.value)
                                }
                            })}
                        />
                    </div>
                    <div>
                        <label>Protein (g)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.nutritionalInfo.protein}
                            onChange={(e) => setFormData({
                                ...formData,
                                nutritionalInfo: {
                                    ...formData.nutritionalInfo,
                                    protein: parseInt(e.target.value)
                                }
                            })}
                        />
                    </div>
                    <div>
                        <label>Carbs (g)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.nutritionalInfo.carbs}
                            onChange={(e) => setFormData({
                                ...formData,
                                nutritionalInfo: {
                                    ...formData.nutritionalInfo,
                                    carbs: parseInt(e.target.value)
                                }
                            })}
                        />
                    </div>
                    <div>
                        <label>Fat (g)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.nutritionalInfo.fat}
                            onChange={(e) => setFormData({
                                ...formData,
                                nutritionalInfo: {
                                    ...formData.nutritionalInfo,
                                    fat: parseInt(e.target.value)
                                }
                            })}
                        />
                    </div>
                </div>
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
                <label>{t('item-image')}</label>
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
                                    imagePreview: URL.createObjectURL(file)
                                }));
                            } catch (error) {
                                setError(error.message);
                            }
                        }
                    }}
                />
                {formData.imagePreview && (
                    <div className={styles.imagePreview}>
                        <Image 
                            src={formData.imagePreview} 
                            alt="Preview" 
                            width={60} 
                            height={60}
                            style={{ objectFit: 'cover' }}
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
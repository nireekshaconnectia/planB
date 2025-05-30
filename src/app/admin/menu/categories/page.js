"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import styles from './categories.module.css';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import CategoryList from '@/components/admin/categories/CategoryList';
import Backdrop from '@/components/backdrop/backdrop';
import handleDelete from '@/lib/hooks/handleDeleteCategories';
import { useRouter } from 'next/navigation';

export default function Categories() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const t = useTranslations();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.token) {
            fetchCategories();
        }
    }, [session]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                // Format the categories data
                const formattedCategories = data.data.categories.map(category => ({
                    id: category._id,
                    name: category.name,
                    description: category.description,
                    imageUrl: category.image,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt
                }));
                setCategories(formattedCategories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const success = await handleDelete(categoryId, session?.user?.token);
            if (success) {
                setCategories(prevCategories => 
                    prevCategories.filter(category => category.id !== categoryId)
                );
            }
        } catch (error) {
            console.error('Error in delete operation:', error);
            alert('Failed to delete category. Please try again.');
        }
    };

    const handleAddClick = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    const handleSave = () => {
        fetchCategories();
        handleCloseForm();
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{t("categories")}</h1>
                <button 
                    onClick={handleAddClick}
                    className={styles.addButton}
                >
                    {t("add-new-category")}
                </button>
            </div>

            <CategoryList 
                categories={categories}
                onDelete={handleDeleteCategory}
                onEdit={handleEdit}
            />

            {showForm && (
                <>
                    <Backdrop onClick={handleCloseForm} />
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <CategoryForm 
                            onSave={handleSave}
                            onClose={handleCloseForm}
                            initialData={editingCategory}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

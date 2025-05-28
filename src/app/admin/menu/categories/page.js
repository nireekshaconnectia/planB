"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './categories.module.css';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import CategoryList from '@/components/admin/categories/CategoryList';
import Backdrop from '@/components/backdrop/backdrop';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const t = useTranslations();

    const fetchCategories = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`);
        const json = await response.json();

        const formatted = json.data.categories.map((cat) => ({
            id: cat._id,
            name: cat.name,
            description: cat.description,
            imageUrl: cat.image, // 💡 match what your component expects
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
        }));

        setCategories(formatted);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};


    const handleDelete = async (id) => {
        await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
        fetchCategories();
    };

    useEffect(() => { fetchCategories(); }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{t("categories")}</h1>
                <button 
                    onClick={() => {
                        setEditingCategory(null);
                        setShowForm(true);
                    }}
                    className={styles.addButton}
                >
                    {t("add-new-category")}
                </button>
            </div>

            {showForm && (
                <>
                    <Backdrop onClick={() => setShowForm(false)} />
                    <div className={styles.modal}>
                        <CategoryForm 
                            onSave={fetchCategories}
                            initialData={editingCategory}
                            onClose={() => setShowForm(false)}
                        />
                    </div>
                </>
            )}

            <CategoryList 
                categories={categories}
                onDelete={handleDelete}
                onEdit={(category) => {
                    setEditingCategory(category);
                    setShowForm(true);
                }}
            />
        </div>
    );
}

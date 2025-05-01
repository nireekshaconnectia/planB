"use client";
import { useState, useEffect } from 'react';
import styles from './categories.module.css';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import CategoryList from '@/components/admin/categories/CategoryList';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        const response = await fetch('/api/admin/categories');
        setCategories(await response.json());
    };

    const handleDelete = async (id) => {
        await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
        fetchCategories();
    };

    useEffect(() => { fetchCategories(); }, []);

    return (
        <div className={styles.container}>
            <h1>Categories</h1>
            <div className={styles.content}>
                <CategoryForm 
                    onSave={fetchCategories}
                    initialData={editingCategory}
                />
                <CategoryList 
                    categories={categories}
                    onDelete={handleDelete}
                    onEdit={setEditingCategory}
                />
            </div>
        </div>
    );
}

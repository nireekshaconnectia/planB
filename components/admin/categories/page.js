// app/admin/categories/page.js
"use client";
import { useState, useEffect } from 'react';
import styles from './categories.module.css';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import CategoryList from '@/components/admin/categories/CategoryList';
import { useSession } from 'next-auth/react';

export default function Categories() {
    const { data: session } = useSession();
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        if (!session?.user?.token) return;
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`, {
                headers: {
                    'Authorization': `Bearer ${session.user.token}`
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setCategories(data.data);
            } else {
                setError('Failed to fetch categories');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!session?.user?.token) return false;
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.user.token}`
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                await fetchCategories();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting category:', error);
            return false;
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [session]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h1>Categories</h1>
            <div className={styles.content}>
                <CategoryForm 
                    onSave={fetchCategories}
                    initialData={editingCategory}
                    onClose={() => setEditingCategory(null)}
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
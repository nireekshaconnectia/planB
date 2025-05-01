"use client";
import { useState } from 'react';
import styles from './categoryForm.module.css';

export default function CategoryForm({ onSave, initialData = null }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        image: null,
        imagePreview: initialData?.imageUrl || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSend.append(key, value);
        });

        try {
            await fetch('/api/admin/categories', {
                method: initialData ? 'PUT' : 'POST',
                body: formDataToSend
            });
            onSave();
            if (!initialData) setFormData({ name: '', description: '', image: null, imagePreview: '' });
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category Name"
                required
            />
            <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        setFormData(prev => ({
                            ...prev,
                            image: file,
                            imagePreview: URL.createObjectURL(file)
                        }));
                    }
                }}
            />
            {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" />}
            <button type="submit">{initialData ? 'Update' : 'Create'}</button>
        </form>
    );
}

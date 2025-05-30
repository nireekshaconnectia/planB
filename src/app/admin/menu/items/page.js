"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import styles from './items.module.css';
import ItemForm from '@/components/admin/items/ItemForm';
import ItemList from '@/components/admin/items/ItemList';
import Backdrop from '@/components/backdrop/backdrop';
import { useRouter } from 'next/navigation';

function mapMenuItemToForm(item) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    categories: item.categories
      ? item.categories.map(cat => typeof cat === 'object' ? cat._id : cat)
      : item.category
        ? [item.category]
        : [],
    isAvailable: item.isAvailable,
    image: item.imageUrl || item.image || '',
    nutritionalInfo: item.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 },
    preparationTime: item.preparationTime || 5,
    ingredients: item.ingredients || [],
  };
}

export default function MenuItems() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const t = useTranslations();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin');
        }
    }, [status, router]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // The data is directly in the data array
                const itemsData = data.data;
                
                if (!itemsData || !Array.isArray(itemsData)) {
                    console.error('No items data found in response');
                    setItems([]);
                    return;
                }

                // Format the items data
                const formattedItems = itemsData.map(item => ({
                    id: item._id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    imageUrl: item.image,
                    category: item.category,
                    isAvailable: item.isAvailable,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }));

                console.log('Formatted Items:', formattedItems); // Debug log
                setItems(formattedItems);
            } else {
                console.error('API returned error:', data);
                setError(data.message || 'Failed to load menu items');
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setError(error.message || 'Failed to load menu items');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!session?.user?.token) {
            alert('Authentication required to delete items');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.user.token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setItems(prevItems => 
                    prevItems.filter(item => item.id !== itemId)
                );
            } else {
                throw new Error(data.message || 'Failed to delete item');
            }
        } catch (error) {
            console.error('Error in delete operation:', error);
            alert('Failed to delete menu item. Please try again.');
        }
    };

    const handleAddClick = () => {
        if (!session?.user?.token) {
            alert('Authentication required to add items');
            return;
        }
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(mapMenuItemToForm(item));
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const handleSave = () => {
        fetchItems();
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
                <h1>{t("menu-items")}</h1>
                <button 
                    onClick={handleAddClick}
                    className={styles.addButton}
                >
                    {t("add-new-item")}
                </button>
            </div>

            <ItemList 
                items={items}
                onDelete={handleDeleteItem}
                onEdit={handleEdit}
            />

            {showForm && (
                <>
                    <Backdrop onClick={handleCloseForm} />
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <ItemForm 
                            onSave={handleSave}
                            onClose={handleCloseForm}
                            initialData={editingItem}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

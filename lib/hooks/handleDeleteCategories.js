"use client";
import { useSession } from 'next-auth/react';

const handleDelete = async (id, token) => {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    try {
        const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!deleteResponse.ok) {
            throw new Error('Failed to delete category');
        }

        return true;
    } catch (error) {
        console.error('Error in handleDelete:', error);
        throw error;
    }
};

export default handleDelete;
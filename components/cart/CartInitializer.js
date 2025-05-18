'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCart } from '@/store/cartSlice';

export default function CartInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          if (items && typeof items === 'object') {
            dispatch(setCart(items));
          }
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
      }
    };

    initializeCart();

    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        initializeCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  return null;
} 
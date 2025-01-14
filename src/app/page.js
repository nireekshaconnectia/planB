
"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Categorey from '@/components/categorey';
import Items from '@/components/itemList/itemsList';
import Cart from '@/components/cart';
import Subheader from '@/components/subheader';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkBodyClass = () => {
      const body = document.querySelector('body');
      if (body && body.classList.contains('main-mobile')) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Initial check
    checkBodyClass();

    // Optional: Add an event listener to handle dynamic class changes
    window.addEventListener('resize', checkBodyClass);

    return () => {
      window.removeEventListener('resize', checkBodyClass);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center p-10 g-20">
      <Subheader />
      <Categorey />
      <Items />
      <Cart />
    </div>
  );
}

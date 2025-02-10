
"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/header'
import Categorey from '@/components/categorey';
import Items from '@/components/itemList/itemsList';
import Cart from '@/components/cart';
import Subheader from '@/components/subheader';
import SelectTableStore from '@/components/selectStoreTable/selectStoreTable';

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
    <>
    <Header logo="http://planb.weblexia.in/wp-content/uploads/2024/11/planB-logo.png" />
    <div className="flex min-h-screen flex-col items-center p-10 g-20">
      <Subheader />
      <Categorey />
      <Items />
      <Cart />
      <SelectTableStore />
    </div>
    </>
  );
}

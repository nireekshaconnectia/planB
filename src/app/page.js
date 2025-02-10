"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Category from '@/components/categorey'; // Corrected spelling
import Items from '@/components/itemList/itemsList';
import Cart from '@/components/cart';
import Subheader from '@/components/subheader';
import SelectTableStore from '@/components/selectStoreTable/selectStoreTable';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    // Initial check
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <>
      <Header logo="http://planb.weblexia.in/wp-content/uploads/2024/11/planB-logo.png" />
      <div className="flex min-h-screen flex-col items-center  g-20" style={{ padding: isMobile ? '10px 0px' : '20px' }}>
        <Subheader />
        <Category />
        <Items />
        <Cart />
        <SelectTableStore />
      </div>
    </>
  );
}
"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Category from '@/components/categorey';
import Items from '@/components/itemList/itemsList';
import Cart from '@/components/cart';
import Subheader from '@/components/subheader';
import SelectFirstPage from '@/components/selectFirstPage/SelectFirstPage';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Show popup once per session
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
      sessionStorage.setItem('hasSeenPopup', 'true');
    }
  }, []);

  return (
    <>
      <Header />
      <SelectFirstPage 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
      />
      <div className="flex min-h-screen flex-col items-center g-20" style={{ padding: isMobile ? '10px 0px' : '0px' }}>
        <Subheader />
        <Category />
        <Items />
        <Cart />
      </div>
    </>
  );
}

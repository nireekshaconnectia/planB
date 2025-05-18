'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Category from '@/components/categorey';
import Items from '@/components/itemList/itemsList';
import Cart from '@/components/cart';
import Subheader from '@/components/subheader';
import SelectFirstPage from '@/components/selectFirstPage/SelectFirstPage';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem('hasSeenPopup')) {
      setShowFirstPage(true);
      sessionStorage.setItem('hasSeenPopup', 'true');
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = showFirstPage ? 'hidden' : '';
    return () => document.body.style.overflow = '';
  }, [showFirstPage]);

  if (showFirstPage) {
    return <SelectFirstPage isOpen={showFirstPage} onClose={() => setShowFirstPage(false)} />;
  }

  return (
    <>
      <Header />
      <div
        className="flex min-h-screen flex-col items-center g-20"
        style={{ padding: isMobile ? '10px 0px' : '0px' }}
      >
        <Subheader />
        <Category />
        <Items />
        <Cart />
      </div>
    </>
  );
}

// hooks/useSmoothScroll.js
"use client"; // Mark this as a client component

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const useSmoothScroll = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash; // Get the hash (e.g., "#section1")
      if (hash) {
        const targetElement = document.querySelector(hash); // Find the target element
        if (targetElement) {
          const offset = 100; // Adjust this value to match the height of your sticky header
          const targetPosition = targetElement.offsetTop - offset; // Calculate the scroll position

          // Smooth scroll to the target position
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      }
    };

    // Listen for route changes (including hash changes)
    router.events.on('hashChangeStart', handleHashChange);

    // Handle initial load with a hash in the URL
    handleHashChange();

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      router.events.off('hashChangeStart', handleHashChange);
    };
  }, [router, pathname]); // Re-run the effect when the route or pathname changes
};

export default useSmoothScroll;
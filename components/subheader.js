"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiInstagramFill } from 'react-icons/ri';
import { SiTiktok } from 'react-icons/si';
import { IoLocation } from 'react-icons/io5';
import { FaStar, FaTruck } from 'react-icons/fa';
import { SiLinktree } from 'react-icons/si';

export default function Subheader({ fburl }) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Check if the component is rendered on the client-side
  useEffect(() => {
    setIsClient(true); // Set to true after the component is mounted
  }, []);

  // Ensure router is available before using it
  const feedback = () => {
    if (router) {
      router.push('/feedback');
    }
  };

  const insta = () => {
    // Ensure this runs on the client side
    if (typeof window !== 'undefined') {
      window.open('https://www.instagram.com/planb.qa/');
    }
  };

  const location = () => {
    // Ensure this runs on the client side
    if (typeof window !== 'undefined') {
      window.open('https://maps.app.goo.gl/wByeN8tbfEGTAZBb7');
    }
  };


  if (!isClient) {
    // Prevent rendering until client-side rendering is ready
    return null;
  }

  return (
    <div className="subheader flex col">
      <div className="text-logo">PlanB Cafe</div>
      <div className="flex g-5 icon-box">
        <RiInstagramFill onClick={insta} style={{ cursor: 'pointer' }} />
        <IoLocation onClick={location} style={{ cursor: 'pointer' }} />
        <FaStar onClick={feedback} style={{ cursor: 'pointer' }} />
        <FaTruck onClick={feedback} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

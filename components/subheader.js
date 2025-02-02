"use client";
import React from 'react';
import { useRouter } from 'next/router';
import { RiInstagramFill } from 'react-icons/ri';
import { SiTiktok } from 'react-icons/si';
import { IoLocation } from 'react-icons/io5';
import { FaStar, FaTruck } from 'react-icons/fa';
import { SiLinktree } from 'react-icons/si';

// Uppercase name for React component
export default function Subheader({ fburl }) {
  const router = useRouter();

  // Handler for feedback page navigation
  const feedback = () => {
    router.push('/feedback');
  };

  // Social media and location handlers
  const insta = () => {
    window.open('https://www.instagram.com/planb.qa/');
  };

  const location = () => {
    window.open('https://maps.app.goo.gl/wByeN8tbfEGTAZBb7');
  };

  const linktree = () => {
    window.open('https://linktr.ee');
  };

  return (
    <div className="subheader flex col">
      <div className="text-logo">PlanB Cafe</div>
      <div className="flex g-5 icon-box">
        {/* Icons with click events */}
        <RiInstagramFill onClick={insta} style={{ cursor: 'pointer' }} />
        <SiTiktok onClick={insta} style={{ cursor: 'pointer' }} />
        <IoLocation onClick={location} style={{ cursor: 'pointer' }} />
        <FaStar onClick={feedback} style={{ cursor: 'pointer' }} />
        <FaTruck onClick={feedback} style={{ cursor: 'pointer' }} />
        <SiLinktree onClick={linktree} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

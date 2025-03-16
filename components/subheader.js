"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiInstagramFill } from "react-icons/ri";
import { SiTiktok } from "react-icons/si";
import { IoLocation } from "react-icons/io5";
import { FaStar, FaTruck } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import DeliveryOptions from "@/components/DeliveryOptions/DeliveryOptions";

export default function Subheader({ fburl }) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);

  // Ensure this component only runs on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const feedback = () => {
    router.push("/feedback");
  };

  const insta = () => {
    window.open("https://www.instagram.com/planb.qa/");
  };

  const location = () => {
    window.open("https://maps.app.goo.gl/aSjhu1mveHaVqtKq5");
  };

  if (!isClient) {
    return null; // Prevents rendering on the server
  }

  return (
    <>
      <div className="subheader flex col">
        <div className="text-logo">PlanB Cafe</div>
        <div className="flex g-5 icon-box">
          <RiInstagramFill onClick={insta} style={{ cursor: "pointer" }} />
          <IoLocation onClick={location} style={{ cursor: "pointer" }} />
          <FaStar onClick={feedback} style={{ cursor: "pointer" }} />
          <FaTruck onClick={() => setShowDeliveryPopup(true)} style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* Delivery Options Popup */}
      <DeliveryOptions 
        isOpen={showDeliveryPopup} 
        onClose={() => setShowDeliveryPopup(false)} 
      />
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import UserPage from "@/components/userPage/userPage";
import Profile from "@/components/auth/user/profile";
import OrderHistory from "@/components/auth/user/OrderHistory";
import Settings from "@/components/auth/user/Settings";

// Optionally, import other components like AddressContent if you plan to use them
// import AddressContent from "@/components/auth/user/addressContent";

const ProfilePage = () => {
  const { id } = useParams(); // Get dynamic route parameter like "user-details"
  const router = useRouter();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    // Define allowed pages and their corresponding components
    const pages = {
      "user-details": { title: "User Profile", content: <Profile /> },
      settings: { title: "Settings", content: <Settings /> },
      "order-history": { title: "Order History", content: <OrderHistory /> },
      addresses: {
        title: "Addresses",
        content: <p>Address section is unavailable at the moment.</p>, // Fallback for missing AddressContent
      },
    };

    // Set the page data based on the route parameter
    if (pages[id]) {
      setPageData(pages[id]);
    } else {
      // If the page doesn't exist, show a fallback message and prevent redirect
      setPageData({
        title: "Page Not Found",
        content: <p>This page is unavailable.</p>, // Display a friendly message for unknown routes
      });
    }
  }, [id, router]);

  if (!pageData) return null; // Prevent rendering before redirect

  return <UserPage title={pageData?.title}>{pageData?.content}</UserPage>;
};

export default ProfilePage;

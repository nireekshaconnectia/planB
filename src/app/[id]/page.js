"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import UserPage from "@/components/userPage/userPage";
import Profile from "@/components/auth/user/profile";
import OrderHistory from "@/components/auth/user/OrderHistory"
import Settings from "@/components/auth/user/Settings"

const ProfilePage = () => {
  const { id } = useParams(); // Get dynamic route parameter like "user-details"
  const router = useRouter();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        // Dynamically import components
        const { default: SettingsContent } = await import("@/components/auth/user/settings");
        const { default: OrdersContent } = await import("@/components/auth/user/OrderHistory");
        const { default: AddressContent } = await import("@/components/auth/user/addressContent");

        // Define allowed pages and their corresponding components
        const pages = {
          "user-details": { title: "User Profile", content: <Profile /> },
          settings: { title: "Settings", content: <Settings /> },
          "order-history": { title: "Order History", content: <OrderHistory /> },
          addresses: { title: "Addresses", content: <AddressContent /> },
        };

        // Set the page data based on the route parameter
        if (pages[id]) {
          setPageData(pages[id]);
        } else {
          router.replace("/"); // Redirect to homepage if the page doesn't exist
        }
      } catch (error) {
        console.warn("⚠️ Some components could not be loaded:", error);
      }
    };

    loadComponents(); // Load components on mount
  }, [id, router]);

  if (!pageData) return null; // Prevent rendering before redirect

  return <UserPage title={pageData?.title}>{pageData?.content}</UserPage>; // Correct rendering
};

export default ProfilePage;

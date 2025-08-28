"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Category from "@/components/categorey";
import Items from "@/components/itemList/itemsList";
import Cart from "@/components/cart";
import Subheader from "@/components/subheader";
import SelectFirstPage from "@/components/selectFirstPage/SelectFirstPage";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(false);
  const router = useRouter();

  // ✅ Hook 1: Detect screen size
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // ✅ Hook 2: First page popup
  useEffect(() => {
    if (!sessionStorage.getItem("hasSeenPopup")) {
      setShowFirstPage(true);
      sessionStorage.setItem("hasSeenPopup", "true");
    }
  }, []);

  // ✅ Hook 3: Disable scroll if popup is open
  useEffect(() => {
    document.body.style.overflow = showFirstPage ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showFirstPage]);

  // ✅ Hook 4: Handle cafeTable param and redirect if missing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tableFromUrl = urlParams.get("cafeTable");

    // 🔄 Redirect to home if no cafeTable param
    if (!tableFromUrl) {
      router.replace("/");  // redirect to homepage
      return;
    }

    const localData = localStorage.getItem("cafeTableData");
    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
    const now = Date.now();

    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        const isExpired = now - parsed.timestamp > SIX_HOURS_MS;
        const isDifferent = parsed.value !== tableFromUrl;

        if (isExpired || isDifferent) {
          localStorage.setItem(
            "cafeTableData",
            JSON.stringify({ value: tableFromUrl, timestamp: now })
          );
        }
      } catch {
        localStorage.setItem(
          "cafeTableData",
          JSON.stringify({ value: tableFromUrl, timestamp: now })
        );
      }
    } else {
      localStorage.setItem(
        "cafeTableData",
        JSON.stringify({ value: tableFromUrl, timestamp: now })
      );
    }
  }, [router]);

  // ✅ Render UI
  return (
    <>
      {showFirstPage && (
        <SelectFirstPage
          isOpen={showFirstPage}
          onClose={() => setShowFirstPage(false)}
        />
      )}

      {!showFirstPage && (
        <>
          <Header />
          <div
            className="flex min-h-screen flex-col items-center g-20"
            style={{ padding: isMobile ? "10px 0px" : "0px" }}
          >
            <Subheader />
            <Category />
            <Items />
            <Cart />
          </div>
        </>
      )}
    </>
  );
}

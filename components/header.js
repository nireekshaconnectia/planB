"use client";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaCaretDown } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import LanguageModal from "@/components/languagemodal/languagemodal";
import SideMenu from "@/components/sideMenu/sideMenu";
import PropTypes from "prop-types";

const Header = ({ logo, menu, keywords }) => {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleUserClick = () => {
    if (user) {
      setMenuOpen(true); // Open SideMenu if logged in
    } else {
      router.push("/login"); // Redirect to login if not logged in
    }
  };

  return (
    <>
      <Head>
        <title>Your Page Title</title>
        <meta name="description" content="Your page description" />
      </Head>

      <div className="header" id="header">
        {/* User Icon */}
        <div className="user-login">
          <FaUser onClick={handleUserClick} style={{ cursor: "pointer" }} />
        </div>
      </div>

      <div className="sub-header flex space-between w-100">
        {/* Language Switcher */}
        <div className="w-25"></div>

        {/* Site Logo */}
        <div className="site-logo w-50">
          <img src={logo} alt="Site Logo" className="logo-image m-auto" />
        </div>

        <div className="switch-language w-25">
          <div
            className="language-switcher flex g-5"
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
          >
            <TbWorld />
            <p>English</p>
            <FaCaretDown />
          </div>
          <LanguageModal showModal={showModal} setShowModal={setShowModal} />
        </div>
      </div>

      {/* Show SideMenu if menuOpen is true */}
      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
};

// Prop Types Validation
Header.propTypes = {
  logo: PropTypes.string.isRequired,
  menu: PropTypes.array,
  keywords: PropTypes.array,
};

export default Header;

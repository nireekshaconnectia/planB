"use client";
import Head from "next/head";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import LanguageModal from "@/components/languagemodal";
import LoginFormModal from "@/components/login/userlogin";
import { FaCaretDown } from "react-icons/fa";

const Header = ({ logo, menu, keywords }) => {
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <>
      <div className="header" id="header">
        {/* User Icon */}
        <div className="user-login">
          <FaUser onClick={() => setShowLoginModal(true)} />
          <LoginFormModal
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
          />
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
        >
          <TbWorld />
          English
          <FaCaretDown />
        </div>
        <LanguageModal showModal={showModal} setShowModal={setShowModal} />
        </div>
        
      </div>
    </>
  );
};

export default Header;

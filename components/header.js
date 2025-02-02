"use client";
import Head from "next/head";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaCaretDown } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import LanguageModal from "@/components/languagemodal/languagemodal";
import PropTypes from "prop-types";

const Header = ({ logo, menu, keywords }) => {
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const login = () => {
    router.push("/login");
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
          <FaUser onClick={login} style={{ cursor: "pointer" }} />
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
            English
            <FaCaretDown />
          </div>
          <LanguageModal showModal={showModal} setShowModal={setShowModal} />
        </div>
      </div>
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
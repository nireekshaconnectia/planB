"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaCaretDown } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useSelector } from "react-redux"; // Import Redux hook
import LanguageModal from "@/components/languagemodal/languagemodal";
import SideMenu from "@/components/sideMenu/sideMenu";
import SelectFirstPage from "@/components/selectFirstPage/SelectFirstPage";
import PropTypes from "prop-types";
import { IoMdArrowBack } from "react-icons/io";

const Header = ({ logo }) => {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔹 Get selected language from Redux store
  const selectedLang = useSelector((state) => state.language.lang) || "en"; 

  // 🔹 Language display mapping
  const languageMap = {
    en: "English",
    ar: "العربية",
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const profile = () => {
    if (user) {
      setMenuOpen(true);
    } else {
      router.push("/login");
    }
  };

  const handleBackClick = () => {
    setShowFirstPage(true);
  };

  return (
    <>
      <SelectFirstPage isOpen={showFirstPage} onClose={() => setShowFirstPage(false)} />

      <div className="header" id="header">
        <div className="showMenu">
          <IoMdArrowBack
            onClick={handleBackClick}
            style={{ cursor: "pointer" }}
            aria-label="Open first page"
            role="button"
            tabIndex="0"
          />
        </div>
        <div className="user-login">
          <FaUser
            onClick={profile}
            style={{ cursor: "pointer" }}
            aria-label="User login or profile"
            role="button"
            tabIndex="0"
          />
        </div>
      </div>

      <div className="sub-header flex space-between w-100">
        <div className="w-25"></div>

        <div className="site-logo w-50">
          <img src={logo} alt="Site Logo" className="logo-image m-auto" />
        </div>

        <div className="switch-language w-25">
          <div
            className="language-switcher flex g-5"
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
            aria-label="Change language"
            role="button"
            tabIndex="0"
          >
            <TbWorld />
            <p>{languageMap[selectedLang]}</p> {/* 🔹 Show selected language */}
            <FaCaretDown />
          </div>
          <LanguageModal showModal={showModal} setShowModal={setShowModal} />
        </div>
      </div>

      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
};

Header.propTypes = {
  logo: PropTypes.string.isRequired,
};

export default Header;

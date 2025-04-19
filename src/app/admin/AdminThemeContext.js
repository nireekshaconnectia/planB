// AdminThemeContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("admin-theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("admin-theme", newTheme);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);

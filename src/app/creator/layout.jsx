"use client";
import React, { createContext, useState } from "react";
import { SellerLayoutContext } from "@contexts/sellerContext";

const Layout = ({ children }) => {
  // State for the layout
  const [active, setActive] = useState("Dashboard");

  return (
    <SellerLayoutContext.Provider value={{ active, setActive }}>
      <div>
        {/* Render the children */}
        {children}
      </div>
    </SellerLayoutContext.Provider>
  );
};

export default Layout;

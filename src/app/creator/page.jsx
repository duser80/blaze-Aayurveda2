"use client";
import React, { useEffect, useState, useContext } from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import Dashboard from "./Dashboard";
import { SellerLayoutContext } from "@contexts/sellerContext";

const menuItems = [
  {
    name: "Dashboard",
    component: "Dashboard",
    icon: <HomeIcon className="h-5 w-5" />,
  },
];

const SellerDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { active, setActive } = useContext(SellerLayoutContext);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (localStorage.getItem("role") !== "seller") {
      redirect("/signin");
    }
  }, []);

  // active can be "Dashboard" || "Inventory" || "Orders" || "Customers" || "Account" || "Coupons"

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen no-scrollbar">
      <div
        className={`fixed  text-white transition-all duration-300 h-screen ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <button onClick={toggleSidebar} className="p-2 focus:outline-none">
          {isCollapsed ? ">" : "<"}
        </button>
        <nav className="mt-4">
          <div className="flex flex-col text-left">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setActive(item.component);
                }}
                className={`p-2 text-left border-2 border-white rounded m-4 h-10 cursor-pointer ${
                  isCollapsed ? "self-center" : ""
                } `}
              >
                {isCollapsed ? <div>{item.icon}</div> : <div>{item.name}</div>}
              </div>
            ))}
          </div>
        </nav>
      </div>
      <div
        className={`flex-grow  p-4 bg-slate-900 text-b no-scrollbar overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {active === "Dashboard" && <Dashboard />}
      </div>
    </div>
  );
};

export default SellerDashboard;

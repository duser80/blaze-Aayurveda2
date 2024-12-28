"use client";

import React, { useEffect, useState, useContext } from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  BanknotesIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Orders from "./Orders";
import Customers from "./Customers";
import Account from "./Account";
import Coupons from "./Coupons";
import { SellerLayoutContext } from "@contexts/sellerContext";
import AddProduct from "./addProduct";
import EditCategory from "./editCategory";

const menuItems = [
  // {
  //   name: "Dashboard",
  //   component: "Dashboard",
  //   icon: <HomeIcon className="h-5 w-5" />,
  // },
  {
    name: "Inventory",
    component: "Inventory",
    icon: <BuildingStorefrontIcon className="h-5 w-5" />,
  },
  {
    name: "Add Product",
    component: "Add Product",
    icon: <BuildingStorefrontIcon className="h-5 w-5" />,
  },
  {
    name: "Orders",
    component: "Orders",
    icon: <ShoppingCartIcon className="h-5 w-5" />,
  },
  {
    name: "Customers",
    component: "Customers",
    icon: <UsersIcon className="h-5 w-5" />,
  },
  {
    name: "Coupons",
    component: "Coupons",
    icon: <BanknotesIcon className="h-5 w-5" />,
  },
  {
    name: "Edit Category",
    component: "Edit Category",
    icon: <BanknotesIcon className="h-5 w-5" />,
  },
  // {
  //   name: "Account",
  //   component: "Account",
  //   icon: <UserCircleIcon className="h-5 w-5" />,
  // },
];

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { active, setActive } = useContext(SellerLayoutContext);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("role") !== "seller"
    ) {
      redirect("/signin");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <span className="text-xl font-semibold">Seller Dashboard</span>
          <button onClick={toggleSidebar} className="">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4">
          <div className="px-2 space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActive(item.component);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
                  active === item.component
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="flex items-center h-16 bg-white shadow">
          <button
            onClick={toggleSidebar}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 ml-4">
            {active}
          </h1>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {active === "Dashboard" && <Dashboard />}
          {active === "Inventory" && <Inventory />}
          {active === "Orders" && <Orders />}
          {active === "Customers" && <Customers />}
          {/* {active === "Account" && <Account />} */}
          {active === "Coupons" && <Coupons />}
          {active === "Add Product" && <AddProduct />}
          {active === "Edit Category" && <EditCategory/>}
        </main>
      </div>
    </div>
  );
}

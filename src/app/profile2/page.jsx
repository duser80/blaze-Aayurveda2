'use client'
// pages/profile.js
import { useState } from "react";

export default function ProfilePage() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "wishlist", label: "Wishlist" },
    { id: "addresses", label: "Addresses" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow p-4 flex items-center space-x-4">
        <img
          src="/profile-pic.jpg"
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-gray-600">johndoe@example.com</p>
        </div>
        <button className="ml-auto px-4 py-2 bg-blue-500 text-white rounded">
          Edit Profile
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow mt-4">
        <div className="flex space-x-4 p-4 border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 ${
                tab === t.id
                  ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {tab === "overview" && <Overview />}
        {tab === "orders" && <Orders />}
        {tab === "wishlist" && <Wishlist />}
        {tab === "addresses" && <Addresses />}
        {tab === "settings" && <Settings />}
      </div>
    </div>
  );
}

// Dummy Components for Tabs
const Overview = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Welcome Back, John!</h2>
    <div className="grid grid-cols-3 gap-4">
      <Card title="Total Orders" value="25" />
      <Card title="Wishlist Items" value="8" />
      <Card title="Reward Points" value="1200" />
    </div>
  </div>
);

const Card = ({ title, value }) => (
  <div className="p-4 bg-white shadow rounded text-center">
    <h3 className="text-gray-600">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Orders = () => <div>Order history here...</div>;
const Wishlist = () => <div>Wishlist items here...</div>;
const Addresses = () => <div>Addresses management here...</div>;
const Settings = () => <div>Account settings here...</div>;


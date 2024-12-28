"use client";
import React, { useState } from "react";

const Account = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notifications, setNotifications] = useState({
    orderConfirmation: false,
    orderStatusChanged: false,
    orderDelivered: false,
    emailNotification: false,
  });

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to handle form submission here
    console.log("Form submitted with values:", {
      currentPassword,
      newPassword,
      confirmNewPassword,
      name,
      storeName,
      location,
      currency,
      email,
      phone,
      address,
      notifications,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded bg-gray-800 text-white">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="space-y-2">
              <div>
                <label className="block mb-1">Current Password</label>
                <input
                  type="password"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">New Password</label>
                <input
                  type="password"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-4 mt-4">Notifications</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block">Order Confirmation</label>
                <input
                  type="checkbox"
                  name="orderConfirmation"
                  checked={notifications.orderConfirmation}
                  onChange={handleNotificationChange}
                  className="h-5 w-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="block">Order Status Changed</label>
                <input
                  type="checkbox"
                  name="orderStatusChanged"
                  checked={notifications.orderStatusChanged}
                  onChange={handleNotificationChange}
                  className="h-5 w-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="block">Order Delivered</label>
                <input
                  type="checkbox"
                  name="orderDelivered"
                  checked={notifications.orderDelivered}
                  onChange={handleNotificationChange}
                  className="h-5 w-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="block">Email Notification</label>
                <input
                  type="checkbox"
                  name="emailNotification"
                  checked={notifications.emailNotification}
                  onChange={handleNotificationChange}
                  className="h-5 w-5"
                />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded bg-gray-800 text-white">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-2">
              <div>
                <label className="block mb-1">Your Name</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Store Name</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Location</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Currency</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Phone</label>
                <input
                  type="tel"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Address</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Account;

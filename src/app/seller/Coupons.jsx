"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCouponById, getCouponsOfSeller } from "@/src/utils/get-url";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCoupons = async () => {
      const data = await getCouponsOfSeller(localStorage.getItem("id"));
      console.log(data);
      setCoupons(data);
    };
    fetchCoupons();
  }, []);

  const handleEdit = (id) => {
    // Handle edit logic here
    router.push(`/seller/editCoupon/${id}`);
    console.log(`Edit coupon with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    // Handle delete logic here
    const response = await deleteCouponById(id);
    if (response.status == 200) {
      toast.success(response.message);
      const data = await getCouponsOfSeller(localStorage.getItem("id"));
      setCoupons(data);
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Coupons</h1>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Coupon Code"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button
          onClick={() => router.push("/seller/addCoupon")}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-full flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Add Coupon
        </button>
      </div>
      <div className="space-y-4">
        {filteredCoupons.map((coupon) => (
          <div key={coupon?._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">{coupon?.coupon_code}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  new Date(coupon?.expiry_date) > new Date() &&
                  new Date() > new Date(coupon?.issue_date)
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {new Date(coupon?.expiry_date) > new Date() &&
                new Date() > new Date(coupon?.issue_date)
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-500" />
                <span>{coupon?.coupon_type}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  {new Date(coupon?.expiry_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />
                <span>Claims left: {coupon?.claims_left}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span>Usage/user: {coupon?.usage_per_user}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(coupon?._id)}
                className="flex items-center justify-center px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                <Edit2 size={16} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(coupon?._id)}
                className="flex items-center justify-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition duration-300 ease-in-out"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredCoupons.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <Tag className="w-16 h-16 mx-auto mb-4" />
          <p>No coupons found</p>
        </div>
      )}
    </div>
  );
};

export default Coupons;

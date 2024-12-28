"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getCouponById,
  updateCoupon,
  getCollectionData,
  getProductsByCategoriesAndSeller,
} from "@/src/utils/get-url";
import { toast } from "react-toastify";
import {
  Tag,
  Calendar,
  DollarSign,
  Percent,
  Package,
  ShoppingBag,
  Save,
} from "lucide-react";

const EditCoupon = (props) => {
  const router = useRouter();
  const couponId = props.params.id;
  const [couponType, setCouponType] = useState("Discount");
  const [couponCode, setCouponCode] = useState("");
  const [claims, setClaims] = useState("");
  const [usagePerUser, setUsagePerUser] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [minimumPurchase, setMinimumPurchase] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchCategories = async () => {
    const data = await getCollectionData("category");
    console.log(data, "data");
    setCategories(
      data.map((category) => ({ value: category._id, name: category.name }))
    );
  };

  const fetchProductsFromCategories = async () => {
    const data = await getProductsByCategoriesAndSeller(
      selectedCategories,
      localStorage.getItem("id")
    );
    console.log(data, "data");
    setProducts(data.map((item) => ({ value: item._id, name: item.itemName })));
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      return;
    }
    fetchProductsFromCategories();
  }, [selectedCategories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const data = await getCouponById(couponId);
        setCouponType(data.coupon_type);
        setCouponCode(data.coupon_code);
        setClaims(data.claims_left);
        setUsagePerUser(data.usage_per_user);
        setTermsAndConditions(data.terms_and_conditions);
        setIssueDate(data.issue_date);
        setExpiryDate(data.expiry_date);
        setMinimumPurchase(data.minimum_purchase);
        setDiscountAmount(data.discount_amount);
        setDiscountType(data.discount_type);
        setMaxDiscount(data.max_discount);
        setSelectedCategories(data.applicable_categories);
        setSelectedProducts(data.applicable_products);
      } catch (error) {
        console.error("Error fetching coupon:", error);
      }
    };

    fetchCoupon();
  }, [couponId]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleProductChange = (product) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((item) => item !== product)
        : [...prev, product]
    );
  };

  const handleUpdateCoupon = async () => {
    const updatedCoupon = {
      coupon_type: couponType,
      coupon_code: couponCode,
      terms_and_conditions: termsAndConditions,
      claims_left: claims ? parseInt(claims) : 0,
      usage_per_user: usagePerUser ? parseInt(usagePerUser) : 0,
      issue_date: issueDate,
      expiry_date: expiryDate,
      minimum_purchase: minimumPurchase ? parseFloat(minimumPurchase) : 0,
      free_shipping: couponType === "Free Shipping" || couponType === "Both",
      discount_amount: discountAmount ? parseFloat(discountAmount) : 0,
      discount_type: discountType,
      max_discount: maxDiscount ? parseFloat(maxDiscount) : 0,
      applicable_categories: selectedCategories,
      applicable_products: selectedProducts,
    };

    console.log("Coupon updated:", updatedCoupon);

    try {
      const response = await updateCoupon(couponId, updatedCoupon);
      console.log(response);
      toast.success("Coupon Updated Successfully");
      router.push("/seller");
    } catch (error) {
      console.log(error, "error");
      toast.error("There was a problem updating the coupon.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Coupon</h1>
      <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Coupon Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={couponType}
            onChange={(e) => setCouponType(e.target.value)}
          >
            <option value="Discount">Discount</option>
            <option value="Free Shipping">Free Shipping</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Coupon Code
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Enter unique code"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Terms and Conditions
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            placeholder="Enter terms and conditions"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Number of Claims
            </label>
            <input
              type="number"
              placeholder="200"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={claims}
              onChange={(e) => setClaims(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Usage per User
            </label>
            <input
              type="number"
              placeholder="1"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={usagePerUser}
              onChange={(e) => setUsagePerUser(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Issue Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Minimum Purchase Amount
          </label>
          <div className="relative">
            <DollarSign
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="number"
              placeholder="0"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={minimumPurchase}
              onChange={(e) => setMinimumPurchase(e.target.value)}
            />
          </div>
        </div>

        {couponType !== "Free Shipping" && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
            </div>
            {discountType === "Percentage" ? (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Discount Percentage
                  </label>
                  <div className="relative">
                    <Percent
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="number"
                      placeholder="Enter percentage"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Maximum Discount
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="number"
                      placeholder="Enter max discount"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Discount Amount
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="number"
                    placeholder="Enter discount amount"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Applicable Categories
          </label>
          <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-green-500"
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => handleCategoryChange(category.value)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Applicable Products
          </label>
          <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
            {products.map((product) => (
              <label
                key={product.value}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-green-500"
                  checked={selectedProducts.includes(product.value)}
                  onChange={() => handleProductChange(product.value)}
                />
                <span>{product.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleUpdateCoupon}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center"
        >
          <Save className="mr-2" size={20} />
          Update Coupon
        </button>
      </div>
    </div>
  );
};

export default EditCoupon;

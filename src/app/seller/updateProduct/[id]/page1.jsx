"use client";
import React, { useState, useEffect } from "react";
import { getProductData } from "@/src/utils/get-url";
import { updateDocument } from "@/src/utils/get-url";

const updateProduct = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState({
    itemName: "ItemName",
    description: "Description",
    category: "Category",
    price: "Price",
    stock: "Stock",
    sales: "Sales",
    paymentMethod: "PaymentMethod",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductData(props.params.id);
        setProductData(data);
        console.log(data, "data");
        setProductData({
          itemName: data?.itemName,
          description: data?.description,
          category: data?.category,
          price: data?.price,
          stock: data?.stock,
          sales: data?.sales,
          paymentMethod: data?.paymentMethod,
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (isEditing) {
      let document = {
        itemName: productData.itemName,
        description: productData.description,
        category: productData.category,
        price: productData.price,
        stock: parseInt(productData.stock),
        sales: productData.sales,
        paymentMethod: productData.paymentMethod,
      };
      const result = await updateDocument(
        "Products",
        props.params.id,
        document
      );
      console.log(`Updated ${result} document(s)`);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="container mx-auto p-4 shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">Update Product</h1>
      <form className="space-y-6">
      <div>
          <button
            type="button"
            onClick={handleUpdate}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isEditing ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isEditing ? "Save Changes" : "Edit Product"}
          </button>
        </div>
        <div>
          <label className="block text-lg font-medium text-white">
            Item Name
          </label>
          <input
            type="text"
            name="itemName"
            value={productData.itemName}
            onChange={handleChange}
            disabled={true}
            className="mt-1 block w-1/2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"

          />
        </div>
        <div>
          <label className="block text-lg font-medium text-white">
            Description
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-1/2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"

          />
        </div>
        <div>
          <label className="block text-lg font-medium text-white">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            disabled={true}
            className="mt-1 block w-1/2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"

          />
        </div>
        <div>
          <label className="block text-lg font-medium text-white">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-1/2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"

          />
        </div>
        <div>
          <label className="block text-lg font-medium text-white">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            className="mt-1 block w-1/2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"

          />
        </div>
        <div>
          <label className="block text-lg font-medium text-white">
            Sales
          </label>
          <input
            type="number"
            name="sales"
            value={productData.sales}
            onChange={handleChange}
            className="mt-1 block w-1/2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"

          />
        </div>
        {/* <div>
          <label className="block text-lg font-medium text-white">
            Payment Method
          </label>
          <input
            type="text"
            name="paymentMethod"
            value={productData.paymentMethod}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-1/2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"

          />
        </div> */}
        
      </form>
    </div>
  );
};

export default updateProduct;

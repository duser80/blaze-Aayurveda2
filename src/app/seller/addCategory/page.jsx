"use client";
import React, { useState } from "react";
import {addCategory} from "@/src/utils/get-url"
import {toast} from "react-toastify"
import {useRouter} from "next/navigation"



const AddCategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const router = useRouter();

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your logic to handle category submission here
    const data = await addCategory(categoryName);
    if(data.status == 409){
      toast.error(data.error)
      return;
    }
    toast.success("Category Added Successfully")
    router.push("/seller");
    console.log("Category Name:", categoryName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white text-center">
          Add Category
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="categoryName"
              className="block text-white font-bold mb-2"
            >
              Category Name:
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={handleCategoryNameChange}
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter category name"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;

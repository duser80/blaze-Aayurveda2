"use client";
import React, { useState, useEffect } from "react";
import { editCategory, getCollectionData } from "@/src/utils/get-url";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Upload, X, ChevronRight } from "lucide-react";
import Link from "next/link";

const uploadObject = async (file) => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: `marketplace/product-images/${
      process.env.NEXT_PUBLIC_WHITE_LABEL_FOR
    }/${Date.now()}_${file.name}`,
    Body: file,
    ACL: "public-read",
  };

  try {
    const toastId = toast.loading("Uploading Image");
    const data = await s3Client.send(new PutObjectCommand(params));
    toast.dismiss(toastId);
    toast.success("Image Uploaded");
    const uploadedObjectUrl = `https://${params.Bucket}.${process.env.NEXT_PUBLIC_AWS_REGION}.cdn.digitaloceanspaces.com/${params.Key}`;
    return { data, url: uploadedObjectUrl };
  } catch (err) {
    toast.error("Error Uploading object", err);
  }
};

const EditCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCollectionData("category");
    setCategories(data);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryImagePreview(category.categoryImage);
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setCategoryImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCategoryImage(null);
    setCategoryImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error("Please select a category to edit");
      return;
    }

    const updateData = { name: categoryName };
    if (categoryImage) {
      const uploadedImage = await uploadObject(categoryImage);
      updateData.categoryImage = uploadedImage.url;
    }

    try {
      const response = await editCategory(selectedCategory._id, updateData);
      if (response.status === 200) {
        toast.success("Category updated successfully");
        fetchCategories();
        setSelectedCategory(null);
        setCategoryName("");
        setCategoryImage(null);
        setCategoryImagePreview(null);
      } else {
        toast.error(response.message || "Error updating category");
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Category</h1>

        {!selectedCategory ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Select a Category to Edit
            </h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category._id}>
                  <button
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>{category.name}</span>
                    <ChevronRight size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Edit Category: {selectedCategory.name}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label
                  htmlFor="categoryImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category Image
                </label>
                <input
                  type="file"
                  id="categoryImage"
                  onChange={handleCategoryImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="categoryImage"
                  className="cursor-pointer w-full p-2 border border-gray-300 rounded-md bg-white text-green-500 text-center flex items-center justify-center"
                >
                  <Upload size={20} className="mr-2" /> Upload Image
                </label>

                {categoryImagePreview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={categoryImagePreview}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition duration-300 ease-in-out"
                >
                  Update Category
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-400 transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/seller" className="text-blue-500 hover:underline">
            Back to Seller Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;

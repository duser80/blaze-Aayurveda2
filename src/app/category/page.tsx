"use client";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getCollectionData } from "@/src/utils/get-url";
import { useRouter } from "next/navigation";

interface Category {
  _id: string; // UUID
  name: string;
  categoryImage: string;
}

export default function DynamicCategories() {
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const toTitleCase = (str: string) => {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
  
    const fetchCategories = async () => {
      const data = (await getCollectionData("category")) as Category[];
      const titleCasedData = data.map((category) => ({
        ...category,
        name: toTitleCase(category.name),
      }));
      console.log(titleCasedData);
      setCategoriesData(titleCasedData);
    };
  
    fetchCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categoriesData.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => {
              router.push(`/category/${category._id}`);
            }}
          >
            <img
              src={category.categoryImage}
              alt={category.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

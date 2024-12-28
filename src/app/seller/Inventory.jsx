"use client";
import React, { useState, useEffect } from "react";
import { getProductsBySeller } from "@/src/utils/get-url";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Package, DollarSign, BarChart2 } from "lucide-react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsBySeller(
          localStorage.getItem("id")
        );
        console.log(fetchedProducts, "Fetched Products");
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // // Calculate total pages
  // const totalPages = Math.ceil(products.length / itemsPerPage);

  // // Get current page products
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // // Change page
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventory</h1>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 mr-4">
                <Image
                  src={product.productImage[0] || "/placeholder.svg"}
                  alt={product.itemName}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{product.itemName}</h2>
                <p className="text-sm text-gray-500">
                  ID: {product._id.slice(-6)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Sold</p>
                  <p className="text-lg font-bold">{product.sales}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-500" />
                <div>
                  <p className="text-sm font-medium">In Stock</p>
                  <p className="text-lg font-bold">{product.stock}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                router.push(`/seller/updateProduct/${product._id}`)
              }
              className="w-full bg-green-500 text-white py-2 px-4 rounded-full font-medium hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Update Product
            </button>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <Package className="w-16 h-16 mx-auto mb-4" />
          <p>No products in inventory</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;

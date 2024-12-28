import { useState } from "react";
import { Search, Star, Home, Book, ShoppingCart, Target } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
    _id: string;
    itemName: string;
    description: string;
    category: string;
    mrp: number;
    discount: number;
    price: number;
    physics: {
      length: string;
      breadth: string;
      height: string;
      weight: string;
    };
    productImage: string[];
    product_views: number;
    sales: number;
    stock: number;
    sellerId: string;
    sellerName: string;
    specifications: Specification[];
    replacementPolicy: string;
    warranty: string;
  }
  
  interface Specification {
    key: string;
    value: string;
  }

  export default function Products({
    products,
    setIsSearchBarActive,
  }: {
    products: Product[];
    setIsSearchBarActive: (value: boolean) => void;
  }) {
    const router = useRouter();
    return (
      <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
        <div className="p-3">
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-3 rounded-lg shadow flex overflow-hidden cursor-pointer"
                onClick={() => {
                  router.push(`/product/${product._id}`);
                  setIsSearchBarActive(false);
                }}
              >
                <img
                  src={product.productImage[0]}
                  alt={product.itemName}
                  className="w-[20%] h-20 object-cover mr-3"
                />
                <div className="flex-1 w-[20%]">
                  <h3 className="font-bold text-sm truncate">
                    {product.itemName}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-500 font-bold text-sm">
                      Rs {product.price}/-
                    </span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
                      <span className="ml-1 text-xs">4.3</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {products.length == 0 && (
            <div className="bg-white p-3 rounded-lg shadow flex overflow-hidden cursor-pointer">
              <span className="text-gray-500">No products found</span>
            </div>
          )}
        </div>
  
        {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 max-w-md mx-auto">
          <button className="flex flex-col items-center">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center">
            <Book className="w-5 h-5" />
            <span className="text-xs mt-1">Learn</span>
          </button>
          <button className="flex flex-col items-center">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs mt-1">Cart</span>
          </button>
          <button className="flex flex-col items-center">
            <Target className="w-5 h-5" />
            <span className="text-xs mt-1">You</span>
          </button>
        </div> */}
      </div>
    );
  }
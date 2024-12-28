"use client";
import { useEffect, useState } from "react";
import { Search, Star, Home, Book, ShoppingCart, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductsByCategory } from "@/src/utils/get-url";
import Image from "next/image";

const DetailedCategoryPage = (props) => {
  console.log(props.params.id);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    FetctProducts();
  }, []);

  const FetctProducts = async () => {
    let data = await getProductsByCategory(props.params.id);
    console.log(data, "products");
    setProducts(data);
  };

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }

  const router = useRouter();
  return (
    <div className=" mx-auto bg-gray-100 min-h-screen">
      <div className="p-3">
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-3 rounded-lg shadow flex overflow-hidden cursor-pointer"
              onClick={() => {
                router.push(`/product/${product._id}`);
              }}
            >
              <img
                src={product.productImage[0]}
                alt={product.itemName}
                className="w-auto h-40   object-cover mr-3"
              />
              {/* <div className="relative w-[80px]   h-auto md:w-[160px]">
                <Image
                  src={product.productImage[0]}
                  alt={product.itemName}
                  fill
                  className="rounded-md "
                />
              </div> */}
              <div className="flex-1 w-[20%]">
                <h3 className="font-bold  text-xl truncate md:text-2xl">
                  {product.itemName}
                </h3>
                <p className="text-xs text-gray-600  truncate md:text-[15px] mt-4">
            {/* {truncateString(product.description, 60)} */}

                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-green-500 font-bold text-sm md:text-2xl">
                    Rs {product.price}/-
                  </span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 md:h-8 md:w-8 fill-yellow-400 stroke-yellow-400" />
                    <span className="ml-1 text-xl md:text-2xl pr-4">4.3</span>
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
    </div>
  );
};

export default DetailedCategoryPage;

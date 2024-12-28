"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import {
  getProductData,
  updateDocument,
  getDocument,
} from "@/src/utils/get-url";

const ProductCard = React.memo(({ product }) => {
  // const [product, setProduct] = useState(null);

  // const fetchData = useCallback(async () => {
  //   const product = await getProductData(productId);
  //   setProduct(product);
  // }, [productId]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // let now = new Date();
  // now.setHours(0, 0, 0, 0);

  // console.log(product, "ProductData");

  return (
    <div>
      {product ? (
        // product.productDateTime >= now ? (
        <Link href={`/marketplace/${product._id}`}>
          <div class="max-w-sm rounded overflow-hidden shadow-lg border-white border-2">
            <img
              class="w-full"
              src={product.productImage}
              alt={product.itemName}
            />
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">{product.itemName}</div>
              <p class="text-base">
                {product.description.length > 30
                  ? `${product.description.slice(0, 30)}...`
                  : product.description}
              </p>
              <p class="text-base">Sell By :{product.sellerName} </p>
              {/* <p class="text-base">By : {event.organizedBy}</p>
                <p class="text-base">Type : {event.type} Event</p> */}
              {/* <p class="text-base">
                  {event.eventDateTime.toLocaleDateString("en-GB")} <br />
                  {event.eventDateTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p> */}
              <p class="text-base">
                {product.price == 0 ? "Free" : product.price}
              </p>
            </div>
            {/* HashTags If required in future */}
            {/* Map kar ke use karna hoga db mai hashtag ki array banegi */}
            <div class="px-6 pt-4 pb-2">
              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #photography
              </span>
              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #travel
              </span>
              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #winter
              </span>
            </div>
          </div>
        </Link>
      ) : // ) : null
      null}
    </div>
  );
});

export default ProductCard;

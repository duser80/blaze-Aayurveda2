"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getCollectionData,
  getUserProductsWithDetails,
} from "@/src/utils/get-url";
import EventCard from "@/src/components/EventCard";
import ProductCard from "@/src/components/ProductCard";
import ProductCard1 from "@/src/components/productcard1";

const ViewMore = (props) => {
  const router = useRouter();

  console.log(props.searchParams.sectionName, "sectionName");

  const [newProducts, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [wishListedProducts, setWishListedProducts] = useState([]);
  const fetchData = async () => {
    if (localStorage.getItem("id")) {
      const { recentProducts, wishlistedProducts } =
        await getUserProductsWithDetails(localStorage.getItem("id"));
      console.log(recentProducts, "recentProducts");
      if (recentProducts?.length > 0) {
        setRecentProducts(recentProducts);
      }
      if (wishlistedProducts?.length > 0) {
        setWishListedProducts(wishlistedProducts);
      }
    }
    // if (registeredEvents.length > 0) {
    //   setRegisteredEvents(registeredEvents);
    // }

    //  yaha pe recently viewed product and wishlisted product ki api call aad karna hai
    let data = await getCollectionData("Products");
    console.log(data, "data");
    setProducts(data.reverse());
    let Tdata = await getCollectionData("Products");
    console.log(Tdata, "data");
    let sortedProducts = Tdata.sort(
      (a, b) => b.product_views - a.product_views
    );
    console.log(sortedProducts, "sortedProducts");
    setTrendingProducts(sortedProducts);
  };

  useEffect(() => {
    fetchData();
  }, []);

  let products;
  switch (props.searchParams.sectionName) {
    case "New Products":
      products = newProducts || [];
      break;
    case "Trending Products":
      products = trendingProducts || [];
      break;
    case "Recently Viewed Products":
      products = recentProducts || [];
      break;
    case "Wish Listed Products":
      products = wishListedProducts || [];
      break;
    default:
      products = [];
  }

  console.log(products, "products");

  return (
    <div>
      <h1 className="text-4xl font-bold p-4 text-center">
        {props.searchParams.sectionName}
      </h1>
      <div className="event-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
        {products.map((product) => (
          // <ProductCard product={product} />
          <ProductCard1 data={product} />
        ))}
      </div>
    </div>
  );
};

export default ViewMore;

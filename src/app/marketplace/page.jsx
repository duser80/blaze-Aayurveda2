"use client";
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../../components/SearchBar";
import FloatingActionButton from "../../components/FloatingActionButton";
import { redirect, useRouter } from "next/navigation";
import {
  getCollectionData,
  getUserProductsWithDetails,
} from "@/src/utils/get-url";
import Link from "next/link";
import CartDropdown from "@/src/components/CartDropdown";
import ProductCard1 from "@/src/components/productcard1";

const MarketGrid = React.memo(({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    {products.map((product) => (
      <ProductCard1 key={product._id} data={product} />
    ))}
  </div>
));

const Banner = React.memo(({ products }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000); // Change event every 3 seconds

    return () => clearInterval(timer);
  }, [products]);

  if (!products || products.length === 0) {
    return <div className="text-2xl font-bold">No products listed</div>;
  }

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 10) {
      return words.slice(0, 10).join(" ") + "...";
    }
    return description;
  };

  const truncatedDescription = truncateDescription(
    products[current].description
  );

  return (
    <div className="px-2 py-2 mx-auto max-w-7xl sm:px-6 md:px-6 lg:px-12 lg:py-12 bg-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mx-auto max-w-7xl">
        <div className="w-full max-w-lg mx-auto aspect-square">
          <img
            className="object-cover w-full h-full rounded-xl"
            src={products[current].productImage[0]}
            alt={products[current].itemName}
          />
        </div>
        <div className="flex flex-col items-start mt-12 mb-16 text-left lg:mt-0 lg:pl-6 xl:pl-24">
          <span className="mb-8 text-4xl font-bold leading-none tracking-tighter text-white md:text-7xl lg:text-5xl">
            {products[current].itemName}
          </span>
          <h1 className="mb-8 text-xl font-bold tracking-widest text-white uppercase">
            {truncatedDescription}
          </h1>
          <Link
            href={`/marketplace/${products[current]._id}`}
            className="inline-block px-8 py-3 text-lg font-bold text-white bg-blue-500 rounded-xl"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
});

const Section = React.memo(({ products, sectionName }) => (
  <div className="m-4">
    <div className="flex justify-between">
      <h1 className="text-4xl font-bold p-4">{sectionName}</h1>
      <Link
        href={{
          pathname: "/marketplace/viewMore",
          query: { sectionName: sectionName },
        }}
      >
        <div className="text-2xl font-bold p-4">View More</div>
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.slice(0, 4).map((product) => (
        <ProductCard1 key={product._id} data={product} />
      ))}
    </div>
  </div>
));

const EventPage = () => {
  const router = useRouter();

  const [isSearchBarActive, setIsSearchBarActive] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [role, setRole] = useState("user");

  const [newProducts, setNewProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [wishListedProducts, setWishListedProducts] = useState([]);
  const [bannerProducts, setBannerProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (localStorage.getItem("id")) {
      const { recentProducts, wishlistedProducts } =
        await getUserProductsWithDetails(localStorage.getItem("id"));
      setRecentProducts(recentProducts || []);
      setWishListedProducts(wishlistedProducts || []);
    }
    const data = await getCollectionData("Products");
    if (data) {
      setNewProducts(data.reverse());
    }
    const Tdata = await getCollectionData("Products");
    const sortedProducts = Tdata.sort(
      (a, b) => b.product_views - a.product_views
    );
    setTrendingProducts(sortedProducts);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      if (localStorage.getItem("id")) {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
      }
      // if (!localStorage.getItem("id")) {
      //   redirect("/signin");
      // }
    }
    fetchData();
    fetchAndSortProducts().then((data) => setBannerProducts(data.slice(0, 3)));
  }, []);

  const fetchAndSortProducts = async () => {
    const data = await getCollectionData("Products");
    return data.sort((a, b) => b.product_views - a.product_views);
  };

  return (
    <div className="h-full w-full">
      {newProducts && isLoading ? (
        <div>
          <div className="flex flex-1 flex-col lg:flex-row">
            <div className="flex flex-1">
              <SearchBar
                products={newProducts}
                isActive={isSearchBarActive}
                setIsActive={setIsSearchBarActive}
                filteredProducts={filteredProducts}
                setFilteredProducts={setFilteredProducts}
              />
            </div>
            <div className="flex justify-center self-center mt-4 lg:mt-0 lg:mr-10">
              {/* <CartDropdown /> */}
              {localStorage.getItem("id") && (
                <Link
                  href="/myOrders"
                  className="inline-block bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                >
                  My Orders
                </Link>
              )}
            </div>
          </div>

          {isSearchBarActive ? (
            <MarketGrid products={filteredProducts} />
          ) : (
            <div>
              {newProducts.length === 0 ? (
                <div className="text-2xl font-bold">No products listed</div>
              ) : (
                <Banner products={bannerProducts} />
              )}
              {wishListedProducts?.length !== 0 && (
                <Section
                  products={wishListedProducts}
                  sectionName="Wish Listed Products"
                />
              )}
              {recentProducts?.length !== 0 && (
                <Section
                  products={recentProducts}
                  sectionName="Recently Viewed Products"
                />
              )}
              {trendingProducts?.length !== 0 && (
                <Section
                  products={trendingProducts}
                  sectionName="Trending Products"
                />
              )}
              {newProducts?.length !== 0 && (
                <Section products={newProducts} sectionName="New Products" />
              )}
            </div>
          )}
          {role === "seller" && (
            <FloatingActionButton
              onClick={() => {
                router.push("/addProduct");
              }}
            />
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default EventPage;

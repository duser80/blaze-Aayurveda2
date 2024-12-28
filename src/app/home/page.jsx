"use client";
import React, {useState, useEffect, useCallback} from "react";
import {Search, Heart, MessageSquare, ShoppingCart, Star} from "lucide-react";
// import NavBar from "../components/NavBar";
import {useRouter} from "next/navigation";
import {
    getCollectionData,
    getUserProductsWithDetails,
} from "@/src/utils/get-url";
import LoadingSpinner from "@/src/components/loadingComp";
import Link from "next/link";
// import MobileProductPage from "../components/ActiveSearchBarwithFilterComp";

const tabs = [
    {id: "trending", label: "Trending"},
    {id: "recent", label: "Recent"},
    {id: "new", label: "New"},
    {id: "wishlist", label: "Wishlist"},
];

const Banner = React.memo(({products}) => {
    const [current, setCurrent] = useState(0);
    const router = useRouter();
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % products.length);
        }, 3000); // Change event every 3 seconds

        return () => clearInterval(timer);
    }, [products]);

    if (!products || products.length === 0) {
        return <div className="text-2xl font-bold">No products listed</div>;
    }

    return (
        <div
            // className="bg-white rounded-lg shadow-md mb-6 overflow-hidden cursor-pointer"
            // onClick={() => {
            //   router.push(`/product/${products[current]._id}`);
            // }}
        >
            <img
                src={products[current]?.productImage[0]}
                alt={products[current]?.itemName}
                className="w-full h-64 object-cover cursor-pointer"
                onClick={() => {
                    router.push(`/product/${products[current]._id}`);
                }}
            />
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 truncate">
                        {products[current]?.itemName}
                    </h2>
                </div>
            </div>
        </div>
    );
});

export default function ProductList() {
    const [activeTab, setActiveTab] = useState("trending"); // Active tab state
    const [isSearchBarActive, setIsSearchBarActive] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [role, setRole] = useState("user");

    const [newProducts, setNewProducts] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [wishListedProducts, setWishListedProducts] = useState([]);
    const [bannerProducts, setBannerProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchData = async () => {
        setIsLoading(true);
        if (localStorage.getItem("id")) {
            const {recentProducts, wishlistedProducts} =
                await getUserProductsWithDetails(localStorage.getItem("id"));
            const recentProductsWithRatings = recentProducts.map((product) => ({
                ...product,
                averageRating: calculateAverageRating(product.reviews || []),
            }));
            const wishlistedProductsWithRatings = wishlistedProducts.map(
                (product) => ({
                    ...product,
                    averageRating: calculateAverageRating(product.reviews || []),
                })
            );
            setRecentProducts(recentProductsWithRatings || []);
            setWishListedProducts(wishlistedProductsWithRatings || []);
        }

        const data = await getCollectionData("Products");
        const Tdata = await getCollectionData("Products");
        if (data) {
            const productsWithRatings = data.map((product) => ({
                ...product,
                averageRating: calculateAverageRating(product.reviews || []),
            }));
            setNewProducts(productsWithRatings.reverse());
        }
        if (Tdata) {
            const productsWithRatings = Tdata.map((product) => ({
                ...product,
                averageRating: calculateAverageRating(product.reviews || []),
            }));
            const sortedProducts = productsWithRatings.sort(
                (a, b) => b.product_views - a.product_views
            );
            setTrendingProducts(sortedProducts);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("role");
            setRole(storedRole);
        }
        fetchData();
        fetchAndSortProducts().then((data) => setBannerProducts(data.slice(0, 3)));
    }, []);

    const fetchAndSortProducts = async () => {
        setIsLoading(true);
        const data = await getCollectionData("Products");
        setIsLoading(false);
        return data
            .map((product) => ({
                ...product,
                averageRating: calculateAverageRating(product.reviews || []),
            }))
            .sort((a, b) => b.product_views - a.product_views);
    };

    useEffect(() => {
        console.log(getActiveTabProducts());
    }, [activeTab]);

    const getActiveTabProductsByTabId = (tabId) => {
        switch (tabId) {
            case "recent":
                return recentProducts;
            case "trending":
                return trendingProducts;
            case "new":
                return newProducts;
            case "wishlist":
                return wishListedProducts;
            default:
                return [];
        }
    };

    const visibleTabs = tabs.filter(
        (tab) => getActiveTabProductsByTabId(tab.id).length > 0
    );

    const getActiveTabProducts = () => {
        switch (activeTab) {
            case "recent":
                return recentProducts;
            case "trending":
                return trendingProducts;
            case "new":
                return newProducts;
            case "wishlist":
                return wishListedProducts;
            default:
                return [];
        }
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    };

    return (
        <div className="max-w-md bg-gray-100 min-h-screen">
            {
                isLoading ?
                    <LoadingSpinner/> :
                    <main className="p-4">
                        <Banner products={bannerProducts}/>
                        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                            {visibleTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {getActiveTabProducts().map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer"
                                    onClick={() => router.push(`/product/${product._id}`)}
                                >
                                    <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-xs">
                                        {product.discount}% off
                                    </div>
                                    <img
                                        src={product.productImage[0]}
                                        alt={product.itemName}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center">
                                                <Star className="text-yellow-400 mr-1" size={16}/>
                                                <span className="text-sm text-gray-600">
                      {product.averageRating?.toFixed(1) || "N/A"}
                    </span>
                                            </div>
                                            <span className="text-green-500 font-bold text-sm">
                    Rs {product.price}/-
                  </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-800 truncate">
                                            {product.itemName}
                                        </h3>
                                        <div className="flex space-x-2 mt-2">
                                            {/* <Heart className="text-red-500 cursor-pointer" size={20} /> */}
                                            {/* <MessageSquare className="text-gray-400" size={20} /> */}
                                            {/* <ShoppingCart className="text-gray-400" size={20} /> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
            }
        </div>
    );
}

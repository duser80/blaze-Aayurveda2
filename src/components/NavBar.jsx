"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CartDropdown from "@/src/components/CartDropdown";
import { Search, Menu, X, Star } from "lucide-react";
import { getCollectionData } from "@/src/utils/get-url";

const NavBar = ({
  isActive,
  setIsActive,
  products,
  filteredProducts,
  setFilteredProducts,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    date: null,
    payment: null,
    price: null,
    category: [],
  });
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("Featured");

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const router = useRouter();

  const fetchCategories = async () => {
    const data = await getCollectionData("category");
    console.log(data, "fetched categories");
    setCategories(
      data.map((category) => ({ value: category._id, name: category.name }))
    );
  };

  const handleSearchChange = useCallback((e) => {
    setIsActive(true);
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback(
    (e) => {
      if (filter.category.includes(e)) {
        setFilter({
          ...filter,
          category: filter.category.filter((category) => category !== e),
        });
        setIsActive(true);
      } else {
        setFilter({ ...filter, category: [...filter.category, e] });
        console.log(e); // Check if category value is being set correctly
        setIsActive(true);
      }
    },
    [filter]
  );

  const onSearch = useCallback(
    ({ term, minPrice, maxPrice, category, sortBy }) => {
      // If products are passed, perform search on products
      if (products && filteredProducts && setFilteredProducts) {
        let productResult = products;
        console.log(productResult);

        if (term) {
          productResult = productResult.filter((product) =>
            product.itemName.toLowerCase().includes(term.toLowerCase())
          );
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
          productResult = productResult.filter(
            (product) => product.price >= minPrice && product.price <= maxPrice
          );
        } else if (minPrice !== undefined) {
          productResult = productResult.filter(
            (product) => product.price >= minPrice
          );
        } else if (maxPrice !== undefined) {
          productResult = productResult.filter(
            (product) => product.price <= maxPrice
          );
        }

        console.log(category, "category");
        if (category.length > 0) {
          console.log("it works");
          productResult = productResult.filter((product) =>
            category.includes(product.category)
          );
        }
        console.log(productResult, " categorised products");
        // Add other filters for products here

        switch (sortBy) {
          case "Price: Low to High":
            productResult.sort((a, b) => a.price - b.price);
            break;
          case "Price: High to Low":
            productResult.sort((a, b) => b.price - a.price);
            break;
          case "Newest Arrivals":
            productResult.reverse();
            break;
          case "Trending":
            productResult.sort((a, b) => b.product_views - a.product_views);
            break;
          // Add more cases for other sorting options if necessary
        }

        setFilteredProducts(productResult);
      }
    },
    [products]
  );

  useEffect(() => {
    onSearch({
      term: searchTerm,
      minPrice: minPrice,
      maxPrice: maxPrice,
      category: filter.category,
      sortBy: sortBy,
    });
  }, [searchTerm, filter, onSearch, minPrice, maxPrice, sortBy]);

  /*...*/
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleMenuItemClick = (item) => {
    router.push(item);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const isSignedInOrNot = () => {
      if (typeof window !== "undefined") {
        setIsSignedIn(localStorage.getItem("id") !== null);
      }
    };

    const handleUserSignedIn = () => {
      isSignedInOrNot();
    };

    window.addEventListener("userSignedIn", handleUserSignedIn);

    isSignedInOrNot();

    return () => {
      window.removeEventListener("userSignedIn", handleUserSignedIn);
    };
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    setIsMenuOpen(false);
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setIsSignedIn(false);
    router.push("/signin");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/category" },
    { name: "Login", path: "/signin" },
    { name: "SignUp", path: "/signup" },
  ];

  const logedInMenuItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/category" },
    { name: "Cart", path: "/cart" },
    { name: "My Orders", path: "/myOrders" },
  ];

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full bg-gray-200 rounded-full py-2 px-4 pr-10"
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search"
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-500"
            size={20}
            aria-hidden="true"
          />
        </div>
        {isActive ? (
          <button
            onClick={() => setIsActive(false)}
            className="ml-4 text-gray-700"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <X size={24} />
          </button>
        ) : (
          <button
            onClick={toggleMenu}
            className="ml-4 text-gray-700"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>
      {isActive && (
        <div className="p-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold"></h2>
            <button
              onClick={toggleFilter}
              className="bg-green-500 text-white px-3 py-1 rounded-full text-sm "
            >
              Filter & Sort
            </button>
          </div>
        </div>
      )}

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xs">
            <div className="p-4">
              <h3 className="text-base font-bold mb-3">Price</h3>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-20 border rounded p-1 text-sm"
                  placeholder="min ₹"
                />
                <span className="text-sm">to</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-20 border rounded p-1 text-sm"
                  placeholder="max ₹"
                />
              </div>

              <h3 className="text-base font-bold mt-4 mb-2">
                Customer reviews
              </h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`w-6 h-6 ${
                      rating <= selectedRating
                        ? "fill-yellow-400 stroke-yellow-400"
                        : "stroke-gray-300"
                    }`}
                    onClick={() => setSelectedRating(rating)}
                  />
                ))}
              </div>

              <h3 className="text-base font-bold mt-4 mb-2">Categories</h3>
              {categories.map((category) => (
                <label key={category.value} className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={filter.category.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}

              <h3 className="text-base font-bold mt-4 mb-2">Sort by</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border rounded p-2 text-sm"
              >
                <option>Trending</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>

              <div className="flex justify-between mt-6">
                <button
                  onClick={toggleFilter}
                  className="bg-gray-300 text-black px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={toggleFilter}
                  className="bg-green-500 text-white px-4 py-2 rounded text-sm"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-white shadow-md">
          <ul>
            {(isSignedIn ? logedInMenuItems : menuItems).map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuItemClick(item.path)}
                  className={`w-full text-left px-6 py-3 hover:bg-green-500 hover:text-white
                    "border-b border-gray-200"`}
                >
                  {item.name}
                </button>
              </li>
            ))}
            {isSignedIn && (
              <li>
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-6 py-3 hover:bg-green-500 hover:text-white
                    "border-b border-gray-200"`}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );

  // return (
  // <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
  //   <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
  //     <div className="flex text-2xl font-extrabold">
  //       <Link href="/">Blaze Ayurveda</Link>
  //     </div>

  //     {/* Hamburger menu for mobile */}
  //     <div className="md:hidden flex-row">
  //       <button onClick={toggleMenu} className="text-2xl">
  //         ☰
  //       </button>
  //     </div>

  //     {/* Desktop menu */}
  //     <div className="hidden md:flex items-center">
  //       {isSignedIn ? (
  //         <>
  //           {/* <div className="text-2xl font-extrabold mr-10">
  //             <Link href="/events">Events</Link>
  //           </div> */}
  //           <div className="text-2xl font-extrabold mr-10">
  //             <Link href="/marketplace">Market Place</Link>
  //           </div>
  //           <CartDropdown />
  //           <div className="relative">
  //             <button onClick={() => setShowDropdown(!showDropdown)}>
  //               <Image
  //                 src="https://imgs.search.brave.com/6AwCUksXbtKNR3NLWOjPziV1Wnlj8tUVO4z3-_rZqRg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zMy5h/bWF6b25hd3MuY29t/L21lZGlhLm1peHJh/bmsuY29tL3Byb2Zp/bGVwaWMvNDZmMzYx/OWVmNzU2NGFlZGNm/NjI5MzUxYmU5ZGVh/NTY.jpeg"
  //                 alt="Profile Photo"
  //                 width={40}
  //                 height={40}
  //                 className="rounded-full"
  //               />
  //             </button>
  //             {showDropdown && (
  //               <div className="absolute right-0 mt-2 w-40 bg-black border border-gray-700 border-2 rounded-md shadow-lg">
  //                 <div className="py-1">
  //                   <button
  //                     onClick={() => {
  //                       setShowDropdown(false);
  //                       router.push("/profile");
  //                     }}
  //                     className="block w-full text-left px-4 py-2 text-xl font-bold text-white hover:bg-gray-800"
  //                   >
  //                     Profile
  //                   </button>
  //                 </div>
  //                 <div className="py-1">
  //                   <button
  //                     onClick={handleLogout}
  //                     className="block w-full text-left px-4 py-2 text-xl font-bold text-white hover:bg-gray-800"
  //                   >
  //                     Logout
  //                   </button>
  //                 </div>
  //               </div>
  //             )}
  //           </div>
  //         </>
  //       ) : (
  //         <div className="text-2xl font-extrabold">
  //           <Link href="/signin">Sign In</Link>
  //         </div>
  //       )}
  //     </div>

  //     {/* Mobile menu */}
  //     {isMenuOpen && (
  //       <div className="absolute top-20 right-2 w-40 bg-black border-b border-gray-700 border-2 md:hidden">
  //         {isSignedIn ? (
  //           <>
  //             {/* <Link
  //               href="/events"
  //               className="block p-4 text-xl font-bold hover:bg-gray-800"
  //             >
  //               Events
  //             </Link> */}
  //             <CartDropdown />
  //             <Link
  //               href="/marketplace"
  //               className="block p-4 text-xl font-bold hover:bg-gray-800"
  //             >
  //               Market Place
  //             </Link>
  //             <Link
  //               href="/profile"
  //               className="block p-4 text-xl font-bold hover:bg-gray-800"
  //             >
  //               Profile
  //             </Link>
  //             <button
  //               onClick={handleLogout}
  //               className="block w-full text-left p-4 text-xl font-bold hover:bg-gray-800"
  //             >
  //               Logout
  //             </button>
  //           </>
  //         ) : (
  //           <Link
  //             href="/signin"
  //             className="block p-4 text-xl font-bold hover:bg-gray-100"
  //           >
  //             Sign In
  //           </Link>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // </nav>
  // );
};

export default NavBar;

/* 
import { Search, Menu } from 'lucide-react'

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onMenuClick?: () => void;
}

export default function Header({ onSearch, onMenuClick }: HeaderProps) {
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="I'll create a separate header component that you can easily reuse in your application. Here's how we can do that:

<Thinking>
Referencing my internal reminder:
1. I need to create a reusable React component for the header.
2. I must follow the structure and styling guidelines for React components.
3. I should ensure the component is flexible and can be easily integrated into other parts of the application.
4. I must write complete code without placeholders.
5. I should consider accessibility and best practices.
</Thinking>

Let's create a `Header` component:

```tsx project="E-commerce App" file="components/Header.tsx" type="react"
import { Search, Menu } from 'lucide-react'

interface HeaderProps {
  onSearch?: (searchTerm: string) => void
  onMenuClick?: () => void
}

export default function Header({ onSearch, onMenuClick }: HeaderProps = {}) {
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(event.target.value)
    }
  }

  return (
    <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full bg-gray-200 rounded-full py-2 px-4 pr-10"
          onChange={handleSearchInput}
          aria-label="Search"
        />
        <Search
          className="absolute right-3 top-2.5 text-gray-500"
          size={20}
          aria-hidden="true"
        />
      </div>
      <button
        onClick={onMenuClick}
        className="ml-4 text-gray-700"
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>
    </header>
  )
}
*/

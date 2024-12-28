"use client";
import { useEffect, useState } from "react";
import "./app.css";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import MobileProductPage from "../components/ActiveSearchBarwithFilterComp";
import { getCollectionData } from "../utils/get-url";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchBarActive, setIsSearchBarActive] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);

  const [newProducts, setNewProducts] = useState<any>([]);

  const fetchData = async () => {
    const data = await getCollectionData("Products");
    if (data) {
      setNewProducts(data.reverse());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="max-w-md mx-auto min-h-screen flex flex-col items-center bg-slate-300 text-black">
      <div className="max-w-full mx-auto bg-gray-100 min-h-screen w-[1000px]">
        <NavBar
          products={newProducts}
          isActive={isSearchBarActive}
          setIsActive={setIsSearchBarActive}
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
        />
        {isSearchBarActive ? (
          <MobileProductPage
            products={filteredProducts}
            setIsSearchBarActive={setIsSearchBarActive}
          />
        ) : (
          <div className="min-h-screen min-w-full max-w-md  ">{children}</div>
        )}
      </div>
    </main>
  );
}

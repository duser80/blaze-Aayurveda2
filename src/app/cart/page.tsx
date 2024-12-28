//@ts-nocheck
"use client";
import { NoSymbolIcon, CheckIcon } from "@heroicons/react/24/outline";
import NcInputNumber from "@/src/components/NcInputNumber";
import Prices from "@/src/components/Prices";
// import { Product, PRODUCTS } from "@/src/data/data";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserCartData, addToCartProduct } from "@/src/utils/get-url";
import { ChevronLeft, Minus, Plus, Heart, Share2 } from "lucide-react";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [removeCart, setRemoveCart] = useState(null);
  const [cartUpdated, setCartUpdated] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingEstimate, setShippingEstimate] = useState(0);
  const [taxEstimate, setTaxEstimate] = useState(0);
  const [total, setTotal] = useState(0);

  const handleRemoveFromCart = async (productId) => {
    const id = productId;
    const user_id = localStorage.getItem("id");

    const data = await addToCartProduct(user_id, id, 0);
    console.log(data, "add_to_cart_function");
    setRemoveCart(data);

    // Add a toast notification
    toast("Cart updated!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      progress: undefined,
    });
  };

  const handleUpdateCart = async ({ id, quantity }) => {
    const user_id = localStorage.getItem("id");

    const data = await addToCartProduct(user_id, id, quantity);
    console.log(data, "add_to_cart_function");

    setCartUpdated(data);

    // Add a toast notification
    toast("Cart updated!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      progress: undefined,
    });
  };

  const renderStatusSoldout = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-300 border border-slate-700">
        <NoSymbolIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">Sold Out</span>
      </div>
    );
  };

  const renderStatusInstock = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-300 border border-slate-700">
        <CheckIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">In Stock</span>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("id");
      if (userId) {
        const data = await getUserCartData(userId);
        console.log(data, "Cart Data");
        if (data.length > 0) {
          const totalAmount = data.reduce((total, item) => {
            return total + item.quantity * parseFloat(item.price);
          }, 0);
          setSubtotal(totalAmount);
          setShippingEstimate(200);
        }
        setCartData(data);
      }
    };

    fetchData();
  }, [removeCart, cartUpdated]);

  useEffect(() => {
    const taxRate = 0.18; // 18%
    const taxAmount = subtotal * taxRate;
    setTaxEstimate(taxAmount);
  }, [subtotal, shippingEstimate]);

  useEffect(() => {
    const total = subtotal + shippingEstimate;
    setTotal(total);
  }, [subtotal, shippingEstimate, taxEstimate]);

  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, newQuantity) => {
    console.log(id, newQuantity);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: newQuantity,
    }));
  };

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }

  const renderProduct = (item) => {
    const { _id, productImage, price, itemName, stock, quantity } = item;
    const newQty = quantities[_id] || quantity;

    return (
      <div
        key={item._id}
        className="bg-white rounded-lg shadow-sm mb-4 p-4 flex "
      >
        <Image
          src={productImage[0]}
          alt={itemName}
          width={80}
          height={80}
          sizes="(max-width: 640px) 50px, (max-width: 768px) 100px, (max-width: 1024px) 150px, 200px"
          className="rounded-md object-cover"
        />
        <div className="ml-4 flex-1">
          <h2 className="font-semibold text-sm">
            {" "}
            {/* {truncateString(itemName, 30)} */}
          {itemName}
          </h2>
          <div className="flex justify-between items-center mt-2">
            <span className="text-green-600 font-bold text-sm">
              Rs {price}/-
            </span>
            <div className="flex items-center border rounded-full">
              <button
                className="px-2 py-1"
                onClick={() =>
                  handleQuantityChange(_id, Math.max(1, newQty - 1))
                }
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm">{newQty}</span>
              <button
                className="px-2 py-1"
                onClick={() => {
                  console.log("Hello");
                  handleQuantityChange(_id, Math.min(stock, newQty + 1));
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            className="text-red-500 text-sm mt-2"
            onClick={() => handleRemoveFromCart(_id)}
          >
            Remove
          </button>
          {newQty !== quantity && (
            <button
              type="button"
              className="text-sm mt-2 ml-4 text-green-500 "
              onClick={() => handleUpdateCart({ id: _id, quantity: newQty })}
            >
              Update Cart
            </button>
          )}
        </div>
      </div>
      
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20 grid  w-full">
      <div className="p-4">
        {cartData.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Your cart is empty
          </div>
        ) : (
          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-4">

          {cartData.map((item) => renderProduct(item))}
          </div>
        )}
      </div>

      <div className="bg-white max-w-[450px] w-full mx-auto md:mx-6 p-4 shadow-md self-end">
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">Rs {subtotal.toFixed(2)}/-</span>
        </div>
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            Rs {shippingEstimate.toFixed(2)}/-
          </span>
        </div>
        {/* <div className="flex justify-between mb-4 text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">Rs {taxEstimate.toFixed(2)}/-</span>
        </div> */}
        <div className="flex  justify-between text-lg font-bold mb-4">
          <span>Total</span>
          <span className="text-green-600">Rs {total.toFixed(2)}/-</span>
        </div>
        <Link href="/checkout" className="block w-full">
          <button className="w-full max-w-[450px] mx-auto bg-green-500 text-white py-3 rounded-full font-semibold text-sm">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
   
  );
};

export default CartPage;

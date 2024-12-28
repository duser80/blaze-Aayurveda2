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
        className="bg-white rounded-lg shadow-sm mb-4 p-4 flex"
      >
        {/* <Image
          src={productImage[0]}
          alt={itemName}
          width={80}
          height={80}
          className="rounded-md object-cover"
        /> */}
        {/* <Image
        src={productImage[0]}
          alt={itemName}
          className="rounded-md object-cover w-full h-auto max-w-[100px] sm:max-w-[120px] md:max-w-[150px]"
          /> */}

<div className="relative w-[80px]   h-auto md:w-[160px]">
  <Image
    src={productImage[0]}
    alt={itemName}
    fill
    className="rounded-md object-cover"
  />
</div>

        <div className="ml-4 flex-1">
          <h2 className="font-semibold text-xl md:text-2xl ">
            {" "}
            {truncateString(itemName, 80)}
          </h2>
          <div className="flex justify-between items-center mt-2">
            <span className="text-green-600 font-bold text-sm md:text-2xl">
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
              className="text-sm mt-2 ml-4 text-green-500 shadow-md"
              onClick={() => handleUpdateCart({ id: _id, quantity: newQty })}
            >
              Update Cart
            </button>
          )}
        </div>
      </div>
      // <div
      //   key={index}
      //   className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
      // >
      //   <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
      //     <Image
      //       fill
      //       src={productImage[0]}
      //       alt={itemName}
      //       sizes="300px"
      //       className="h-full w-full object-contain object-center"
      //     />
      //     <Link
      //       href={`/marketplace/${_id}`}
      //       className="absolute inset-0"
      //     ></Link>
      //   </div>

      //   <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
      //     <div>
      //       <div className="flex justify-between ">
      //         <div className="flex-[1.5] ">
      //           <h3 className="text-base font-semibold">
      //             <Link href={`/marketplace/${_id}`}>{itemName}</Link>
      //           </h3>
      //           <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-300">
      //             <div className="flex items-center space-x-1.5">
      //               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      //                 <path
      //                   d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeMiterlimit="10"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //                 <path
      //                   d="M8.35 1.94995L9.69 3.28992"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeMiterlimit="10"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //                 <path
      //                   d="M2.07 11.92L17.19 11.26"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeMiterlimit="10"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //                 <path
      //                   d="M3 22H16"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeMiterlimit="10"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //                 <path
      //                   d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //               </svg>

      //               <span>{`Black`}</span>
      //             </div>
      //             <span className="mx-4 border-l border-slate-700 "></span>
      //             <div className="flex items-center space-x-1.5">
      //               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      //                 <path
      //                   d="M21 9V3H15"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //                 <path
      //                   d="M3 15V21H9"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //                 <path
      //                   d="M21 3L13.5 10.5"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //                 <path
      //                   d="M10.5 13.5L3 21"
      //                   stroke="currentColor"
      //                   strokeWidth="1.5"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 />
      //               </svg>

      //               <span>{`2XL`}</span>
      //             </div>
      //           </div>

      //           <div className="mt-3 flex justify-between w-full sm:hidden relative">
      //             <select
      //               name="qty"
      //               id="qty"
      //               className="form-select text-sm rounded-md py-1 border-slate-700 relative z-10 bg-slate-800 "
      //             >
      //               <option value="1">1</option>
      //               <option value="2">2</option>
      //               <option value="3">3</option>
      //               <option value="4">4</option>
      //               <option value="5">5</option>
      //               <option value="6">6</option>
      //               <option value="7">7</option>
      //             </select>
      //             <Prices
      //               contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
      //               price={price}
      //             />
      //           </div>
      //         </div>

      //         <div className="hidden sm:block text-center relative">
      //           <NcInputNumber
      //             className="relative z-10"
      //             defaultValue={quantity}
      //             max={stock}
      //             onChange={(newQuantity) =>
      //               handleQuantityChange(_id, newQuantity)
      //             }
      //           />
      //         </div>

      //         <div className="hidden flex-1 sm:flex justify-end">
      //           <Prices price={price} className="mt-0.5" />
      //         </div>
      //       </div>
      //     </div>

      //     <div className="flex mt-auto pt-4 items-end justify-between text-sm">
      //       {stock >= quantity ? renderStatusInstock() : renderStatusSoldout()}

      //       <button
      //         type="button"
      //         className="font-medium text-primary-500 "
      //         onClick={() => handleRemoveFromCart(_id)}
      //       >
      //         Remove
      //       </button>
      //       {newQty !== quantity && (
      //         <button
      //           type="button"
      //           className="font-medium text-primary-500 "
      //           onClick={() => handleUpdateCart({ id: _id, quantity: newQty })}
      //         >
      //           Update Cart
      //         </button>
      //       )}
      //     </div>
      //   </div>
      // </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20 grid ">
      <div className="p-4">
        {cartData.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Your cart is empty
          </div>
        ) : (
          cartData.map((item) => renderProduct(item))
        )}
      </div>

      <div  className="bg-white px-12 lg:px-16 py-4 shadow-md self-end md:mx-20">
        <div className="flex justify-between mb-2 text-2xl">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">Rs {subtotal.toFixed(2)}/-</span>
        </div>
        <div className="flex justify-between text-2xl mb-2 ">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold ">
            Rs {shippingEstimate.toFixed(2)}/-
          </span>
        </div>
        {/* <div className="flex justify-between mb-4 text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">Rs {taxEstimate.toFixed(2)}/-</span>
        </div> */}
        <div className="flex justify-between  font-bold text-2xl mb-4">
          <span>Total</span>
          <span className="text-green-600">Rs {total.toFixed(2)}/-</span>
        </div>
        <Link href="/checkout" className="flex w-full md:w-[300px] ml-auto">
          <button className="w-full bg-green-500 text-white py-3 rounded-full font-semibold text-sm">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
    // <div className="nc-CartPage">
    //   <main className="container py-16 lg:pb-28 lg:pt-20 ">
    //     {/* Breadcrumps */}
    //     {/* <div className="mb-12 sm:mb-16">
    //       <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
    //         Shopping Cart
    //       </h2>
    //       <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-400">
    //         <Link href={"/"} className="">
    //           Homepage
    //         </Link>
    //         <span className="text-xs mx-1 sm:mx-1.5">/</span>
    //         <Link href={"/collection"} className="">
    //           Clothing Categories
    //         </Link>
    //         <span className="text-xs mx-1 sm:mx-1.5">/</span>
    //         <span className="underline">Shopping Cart</span>
    //       </div>
    //     </div>

    //     <hr className="border-slate-700 my-10 xl:my-12" /> */}

    //     <div className="flex flex-col lg:flex-row">
    //       <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-700 ">
    //         {cartData.length === 0 && (
    //           <div className="flex text-4xl font-semibold self-center justify-center text-center ">
    //             Your Cart is Empty
    //           </div>
    //         )}
    //         {cartData && cartData.map(renderProduct)}
    //       </div>
    //       <div className="border-t lg:border-t-0 lg:border-l border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
    //       <div className="flex-1">
    //         <div className="sticky top-28">
    //           <h3 className="text-lg font-semibold ">Order Summary</h3>
    //           <div className="mt-7 text-sm text-slate-400 divide-y divide-slate-700/80">
    //             <div className="flex justify-between pb-4">
    //               <span>Subtotal</span>
    //               <span className="font-semibold text-slate-200">
    //                 ₹{subtotal}
    //               </span>
    //             </div>
    //             <div className="flex justify-between py-4">
    //               <span>Shpping estimate</span>
    //               <span className="font-semibold text-slate-200">
    //                 ₹{shippingEstimate}
    //               </span>
    //             </div>
    //             <div className="flex justify-between py-4">
    //               <span>Tax estimate</span>
    //               <span className="font-semibold text-slate-200">
    //                 ₹{taxEstimate}
    //               </span>
    //             </div>
    //             <div className="flex justify-between font-semibold text-slate-200 text-base pt-4">
    //               <span>Order total</span>
    //               <span>₹{total}</span>
    //             </div>
    //           </div>
    //           <ButtonPrimary href="/checkout" className="mt-8 w-full">
    //             Checkout
    //           </ButtonPrimary>
    //           <div className="mt-5 text-sm text-slate-400 flex items-center justify-center">
    //             <p className="block relative pl-5">
    //               <svg
    //                 className="w-4 h-4 absolute -left-1 top-0.5"
    //                 viewBox="0 0 24 24"
    //                 fill="none"
    //               >
    //                 <path
    //                   d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
    //                   stroke="currentColor"
    //                   strokeWidth="1.5"
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                 />
    //                 <path
    //                   d="M12 8V13"
    //                   stroke="currentColor"
    //                   strokeWidth="1.5"
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                 />
    //                 <path
    //                   d="M11.9945 16H12.0035"
    //                   stroke="currentColor"
    //                   strokeWidth="2"
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                 />
    //               </svg>
    //               Learn more{` `}
    //               <a
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 href="##"
    //                 className="text-slate-200 underline font-medium"
    //               >
    //                 Taxes
    //               </a>
    //               <span>
    //                 {` `}and{` `}
    //               </span>
    //               <a
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 href="##"
    //                 className="text-slate-200 underline font-medium"
    //               >
    //                 Shipping
    //               </a>
    //               {` `} infomation
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
};

export default CartPage;

"use client";

import { Popover, Transition } from "@/src/app/headlessui";
import Prices from "@/src/components/Prices";
import { Product } from "@/src/data/data";
import { Fragment } from "react";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/src/shared/Button/ButtonSecondary";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserCartData, addToCartProduct } from "@/src/utils/get-url";
import { toast } from "react-toastify";

export default function CartDropdown() {
  const [cartData, setCartData] = useState(null);
  const [removeCart, setRemoveCart] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    const handleCartUpdate = () => {
      if (localStorage.getItem("id")) {
        fetchData();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    const fetchData = async () => {
      const userId = localStorage.getItem("id");
      if (userId) {
        const data = await getUserCartData(userId);
        console.log(data, "Cart Data");
        setCount(data.length);
        if (data.length > 0) {
          const totalAmount = data.reduce((total, item) => {
            return total + item.quantity * parseFloat(item.price);
          }, 0);
          setSubtotal(totalAmount);
        }
        setCartData(data);
      }
    };

    if (localStorage.getItem("id")) {
      fetchData();
    }
  }, [removeCart]);

  const renderProduct = (item, index, close) => {
    const { _id, itemName, price, productImage, quantity } = item;
    return (
      <div key={index} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            fill
            src={productImage[0]}
            alt={itemName}
            className="h-full w-full object-contain object-center"
          />
          <Link
            onClick={close}
            className="absolute inset-0"
            href={`/marketplace/${_id}`}
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">
                  <Link onClick={close} href={`/marketplace/${_id}`}>
                    {itemName}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  <span>{`Natural`}</span>
                  <span className="mx-2 border-l border-slate-700 h-4"></span>
                  <span>{"XL"}</span>
                </p>
              </div>
              <Prices price={price} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className=" text-slate-400">
              {`Qty`} {quantity}
            </p>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-500 "
                onClick={() => handleRemoveFromCart(_id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
              <span className="mt-[1px]">{count}</span>
            </div>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 8H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Link className="block md:hidden absolute inset-0" href={"/cart"} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10">
                <div className="relative bg-neutral-800">
                  <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                    <h3 className="text-xl font-semibold">Shopping cart</h3>
                    <div className="divide-y divide-slate-700">
                      {cartData && cartData.length > 0 ? (
                        cartData.map((item, index) =>
                          renderProduct(item, index, close)
                        )
                      ) : localStorage.getItem("id") ? (
                        <p className="text-2xl font-bold">
                          No Products in Cart
                        </p>
                      ) : (
                        <p className="text-2xl font-bold">
                          Sign In to access cart
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-5">
                    <p className="flex justify-between font-semibold text-slate-100">
                      <span>
                        <span>Subtotal</span>
                        <span className="block text-sm text-slate-400 font-normal">
                          Shipping and taxes calculated at checkout.
                        </span>
                      </span>
                      <span className="">₹{subtotal}</span>
                    </p>
                    <div className="flex space-x-2 mt-5">
                      <ButtonSecondary
                        href="/cart"
                        className="flex-1 border border-slate-700"
                        onClick={close}
                      >
                        View cart
                      </ButtonSecondary>
                      <ButtonPrimary
                        href="/checkout"
                        onClick={close}
                        className="flex-1"
                      >
                        Check out
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NcInputNumber from "@/src/components/NcInputNumber";
import { toast } from "react-toastify";

import {
  getUserData,
  updateDocument,
  getDocument,
  getProductData,
  updateProductArrays,
  wishlistProduct,
  addToCartProduct,
} from "@/src/utils/get-url";

const EventPage = (props) => {
  const router = useRouter();

  console.log(props.params.id, "id");
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [user, setUser] = useState(null);
  const [wishListed, setWishListed] = useState(false);
  const [addedToCart, setAddedToCartListed] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Fetch the event data when the component mounts

  // Add a function to handle the quantity change
const handleQuantityChange = (event) => {
  setQuantity(event);
};

  const handleWishList = async () => {
    const id = props.params.id;
    const user_id = localStorage.getItem("id");

    const data = await wishlistProduct(user_id, id);
    console.log(data, "wishlistfunction");
    setWishListed(data);
  };

  const handleAddToCartList = async () => {
    const id = props.params.id;
    const user_id = localStorage.getItem("id");

    const data = await addToCartProduct(user_id, id, quantity);
    console.log(data, "add_to_cart_function");
    setAddedToCartListed(data);

    // Add a toast notification
    toast('Cart updated!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      progress: undefined,
    });

  };

  const handleBuy = async () => {
    // console.log(product.nFTLink, "product.nFTLink");
    window.open(product.nFTLink, "_blank");
  };

  const fetchData = async () => {
    const id = props.params.id;
    const user_id = localStorage.getItem("id");

    const { wishListed } = await updateProductArrays(user_id, id);

    setWishListed(wishListed);

    const productData = await getProductData(id);
    if (productData) {
      console.log(productData, "product");
      console.log(productData.description, "description");
      setProduct(productData);
      console.log(productData.sellerId, "sellerId");
      const sellerData = await getUserData(productData.sellerId);
      if (sellerData) {
        console.log(sellerData, "sellerData");
        setSeller(sellerData);
      }
    }

    let product_views = productData.product_views;
    console.log(product_views, "product_views");
    product_views++;
    console.log(product_views, "product_views");

    // Increment the event_count field
    const updatedProduct = await updateDocument("Products", id, {
      product_views,
    });
    console.log(`Updated event count: ${updatedProduct}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {product ? (
        <div className="container mx-auto px-4">
          <div className="mt-8">
            <div className=" flex flex-wrap mx-auto max-w-7xl">
              <div className="w-full lg:max-w-lg lg:w-1/2 rounded-xl">
                <img src={product.productImage} alt={product.itemName} />
              </div>
              <div className="flex flex-col  lg:flex-grow lg:w-1/2 lg:pl-6 xl:pl-24 md:mb-0 xl:mt-0">
                <div className="md:p-8  rounded-lg shadow-md">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold  mb-4">
                    {product.itemName}
                  </h2>
                  <p class="text-white mb-2">
                    Price: {product.price == 0 ? "Free" : product.price}
                  </p>
                  <p class="text-white mb-2">
                    Seller Name: {seller ? seller.name : "Seller Name"}
                  </p>
                  {/* <p className="text-white mb-2">Type: {event.type}</p> */}
                  <p className="text-white mb-2">
                    Description: <br />
                    {product.description.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <p className="text-white mb-2">
                    Specifications: {product.description}
                  </p>

                  {product.stock === 0 ? (
                    <p className="text-red-500">Out of stock</p>
                  ) : product.stock < 10 ? (
                    <p className="text-yellow-500">Hurry up low stock</p>
                  ) : null}
                  
                  <br />
                  {wishListed ? (
                    <button
                      onClick={() => {
                        handleWishList();
                      }}
                      className="w-full md:w-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                      Remove From Wishlist
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleWishList();
                      }}
                      className="w-full md:w-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                    >
                      Add to Wishlist
                    </button>
                  )}
                  {/* {addedToCart ? (
                    <button
                      onClick={() => {
                        handleAddToCartList();
                      }}
                      className="w-full md:w-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                      Remove From Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleAddToCartList();
                      }}
                      className="w-full md:w-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                    >
                      Add to Cart
                    </button>
                  )} */}

                  {/* // In your JSX, add an input field for the quantity and a button to update the cart */}
                  <NcInputNumber 
                    value={quantity} 
                    onChange={handleQuantityChange} 
                    min={1} 
                  />
                  <button
                    onClick={() => {
                      handleAddToCartList();
                    }}
                    className="w-full md:w-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                  >
                    Update Cart
                  </button>

                  <br />
                  <button
                    onClick={() => {
                      handleBuy();
                    }}
                    className="w-full md:w-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default EventPage;

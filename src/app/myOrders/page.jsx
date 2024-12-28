"use client";

import { getOrdersData } from "@/src/utils/get-url";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const MyOrdersPage = () => {
  const router = useRouter();
  const [OrdersData, setOrdersData] = useState([]);

  useEffect(() => {
    // Fetch orders data from the server
    // and set it to the state
    const fetchData = async () => {
      const id = localStorage.getItem("id"); // Get user ID from local storage
      if (!id) {
        console.error("User ID not found in local storage");
        router.push("/signin");
        return;
      }
      const data = await getOrdersData(id); // replace 'users' with your collection name
      if (data) {
        console.log(data, "data");
        setOrdersData(data.reverse());
      }
    };

    fetchData();
  }, []);

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }

  const renderOrderCard = (order, index) => (
    <div
      key={index}
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-sm">
            Order ID: {order?._id.slice(-6)}
          </h2>
          <span className="text-sm text-gray-500">
            {order?.timestamp
              ? new Date(parseInt(order.timestamp)).toLocaleDateString(
                  "en-IN",
                  { year: "numeric", month: "long", day: "numeric" }
                )
              : "Date not available"}
          </span>
        </div>
        {order?.orderedProduct?.map((product) => (
          <div key={product?.productId} className="flex items-center mb-2">
            <Image
              src={product?.productImage[0]}
              alt={product?.itemName}
              width={60}
              height={60}
              className="rounded-md object-cover mr-4"
            />
            <div className="flex-1">
              <h3 className="font-medium text-sm">
                {truncateString(product?.itemName, 30)}
              </h3>
              <p className="text-xs text-gray-500">Qty: {product?.quantity}</p>
              <p className="text-sm font-semibold text-green-600">
                ₹{product?.price}
              </p>
            </div>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm font-medium">Total: ₹{order?.total}</p>
          <p className="text-xs text-gray-500">
            Delivered at: {order?.deliveredAt || "Processing"}
          </p>
        </div>
      </div>
      <Link
        href={`/myOrders/${order?._id}`}
        className="block bg-gray-50 py-3 px-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        View Order Details
        <ChevronRight className="inline-block ml-1 w-4 h-4" />
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>
      {OrdersData.length > 0 ? (
        OrdersData.map(renderOrderCard)
      ) : (
        <div className="text-center text-gray-600 mt-5 bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-sm text-gray-500">
            Your order history will appear here once you make a purchase.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded-full text-sm font-medium"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );

  return (
    // <div>
    //   <h1>My Orders</h1>
    //   {/* Add your order list component here */}
    //   {OrdersData.length > 0 ? (
    //     OrdersData.map((order, index) => (
    //       <div key={index} className=" border-white border-2   ">
    //         <h2>Order ID: {order?._id}</h2>
    //         {/* <p>Order Status: {order.status}</p> */}
    //         {/* will get through shiprocket */}
    //         <p>Order Total: {order?.total}</p>
    //         {order?.orderedProduct?.map((product) => {
    //           return (
    //             <div key={product?.productId}>
    //               <p>Product Name: {product?.itemName}</p>
    //               <p>Product Price: {product?.price}</p>
    //               <p>Product Quantity: {product?.quantity}</p>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     ))
    //   ) : (
    //     <div>
    //       <h2>No Orders Found</h2>
    //     </div>
    //   )}
    // </div>
    <div className="w-2/3 p-10 mx-auto">
      <h1 className="text-center text-3xl text-gray-700 mb-5">My Orders</h1>
      {OrdersData.length > 0 ? (
        OrdersData.map((order, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg m-2 p-5 shadow-md w-full"
          >
            <div className="flex justify-between items-center">
              <h2 className="border-b border-gray-300 pb-2">
                Order ID: {order?._id}
              </h2>
              <h2 className="border-b border-gray-300 pb-2">
                Order Placed at:{" "}
                {new Date(order?.timestamp).toLocaleDateString()}
              </h2>
              <h2 className="border-b border-gray-300 pb-2">
                Order Total: {order?.total}
              </h2>
              <Link
                href={`/myOrders/${order?._id}`}
                className="inline-block px-4 py-2 mt-2 rounded border-2 bg-blue-600 border-white"
              >
                <h2 className="border-b border-gray-300 pb-2">
                  View Order Details
                </h2>
              </Link>
            </div>
            <p>
              Address: {order?.address?.addressLine}, {order?.address?.city},{" "}
              {order?.address?.state}, {order?.address?.country},{" "}
              {order?.address?.zipCode}
            </p>
            <p>
              Name: {order?.address?.firstName} {order?.address?.lastName}
            </p>
            <p>Email: {order?.email}</p>
            <p>Phone Number: {order?.phoneNumber}</p>
            <p>Delivered at: static</p>
            <p>Shipping Estimate: {order?.shippingEstimate}</p>
            <p>Subtotal: {order?.subtotal}</p>
            <p>Tax: {order?.tax}</p>
            {/* <p>Payment Details: {order?.paymentDetails?.razorpay_order_id}, {order?.paymentDetails?.razorpay_payment_id}, {order?.paymentDetails?.razorpay_signature}</p> */}
            {order?.orderedProduct?.map((product) => {
              return (
                <div key={product?.productId} className="mt-2">
                  <img
                    src={product?.productImage}
                    alt={product?.itemName}
                    className="w-20 h-20 object-cover mb-2"
                  />
                  <Link
                    href={`/marketplace/${product?.productId}`}
                    className="inline-block px-4 py-2 mt-2 rounded"
                  >
                    <p className="font-bold text-blue-700">
                      Product Name: {product?.itemName}
                    </p>
                  </Link>
                  <p className="text-gray-600">
                    Product Price: {product?.price}
                  </p>
                  <p className="text-gray-600">
                    Product Quantity: {product?.quantity}
                  </p>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 mt-5">
          <h2>No Orders Found</h2>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;

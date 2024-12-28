"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getOrderDetails } from "@/src/utils/get-url";

export default function OrderDetailPage({ params }) {
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setOrderId(params.id);
  }, [params.id]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderDetails(orderId);
        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (!order) {
    return <div className="text-gray-800">Loading...</div>;
  }

  const orderDate = new Date(parseInt(order.timestamp)).toLocaleDateString();

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Summary</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-600">Order ID</p>
              <p className="text-gray-800">{order._id}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-600">Total</p>
              <p className="text-orange-500 font-bold text-xl">
                ₹{order.total}
              </p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Placed on</p>
            <p className="text-gray-800">{orderDate}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="font-semibold text-gray-800 mb-2">
            {order.orderedProduct.length} item(s)
          </p>
          {!order?.awbData ? (
            <p className="text-gray-600 mb-4">AWB Code not generated</p>
          ) : (
            <p className="text-gray-600 mb-4">
              AWB Code Generated {order.awbData.awb_code}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Product Details
          </h2>
          {order.orderedProduct.map((product, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <Image
                src={product.productImage[0]}
                alt={product.itemName}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div>
                <Link
                  href={`/marketplace/${product.productId}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {product.itemName}
                </Link>
                <p className="text-gray-600">Qty: {product.quantity}</p>
                <p className="text-orange-500 font-bold">
                  ₹{product.price * product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Shipping Address
          </h2>
          <p className="text-gray-800">
            {order.address.firstName} {order.address.lastName}
          </p>
          <p className="text-gray-800">
            {order.address.houseNumber}, {order.address.addressLine}
          </p>
          <p className="text-gray-800">
            {order.address.city}, {order.address.state} {order.address.zipCode}
          </p>
          <p className="text-gray-800">{order.address.country}</p>
          <p className="text-gray-800">{order.phoneNumber}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Price Details
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-800">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {!order.paymentDetails && (
              <div className="flex justify-between text-gray-800">
                <span>COD Charges</span>
                <span>₹50</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2"></div>
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span className="text-orange-500">₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Details
          </h2>
          {order.paymentDetails ? (
            <>
              <p className="text-gray-800">
                Payment ID: {order.paymentDetails.razorpay_payment_id}
              </p>
              <p className="text-gray-800">
                Order ID: {order.paymentDetails.razorpay_order_id}
              </p>
            </>
          ) : (
            <p className="text-gray-800">Cash on Delivery</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tracking Details
          </h2>
          <p className="text-gray-800">
            Status: {order.shiprocketOrder.status}
          </p>
          <p className="text-gray-800">
            Shipment ID: {order.shiprocketOrder.shipment_id}
          </p>
        </div>
      </div>
    </div>
  );
}

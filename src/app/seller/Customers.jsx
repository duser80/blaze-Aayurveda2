"use client";
import React, { useState, useEffect } from "react";
import { getOrdersBySellerID } from "@/src/utils/get-url";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Package,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

const Customers = () => {
  const [orders, setOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const sellerId = localStorage.getItem("id");
        if (!sellerId) {
          console.error("Seller ID not found");
          return;
        }
        const fetchedOrders = await getOrdersBySellerID("Orders", sellerId);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const firstNames = orders.map((order) => order.address.firstName);
  const uniqueFirstNames = Array.from(new Set(firstNames));

  const handleCustomerClick = (firstName) => {
    const customerOrders = orders.filter(
      (order) => order.address.firstName === firstName
    );
    console.log(customerOrders);
    setSelectedCustomer(customerOrders);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Customers</h1>
      <div className="space-y-4">
        {uniqueFirstNames.map((name, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md">
            <button
              onClick={() => handleCustomerClick(name)}
              className="w-full p-4 text-left flex items-center justify-between"
            >
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-500" />
                <span className="font-medium">{name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
            {selectedCustomer &&
              selectedCustomer[0].address.firstName === name && (
                <div className="p-4 border-t border-gray-200">
                  {selectedCustomer.map((order, orderIndex) => (
                    <div key={orderIndex} className="mb-4 last:mb-0">
                      <h3 className="font-semibold mb-2">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {order.email}
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          {order.phoneNumber}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          {order.address.addressLine}, {order.address.city},{" "}
                          {order.address.state}, {order.address.zipCode}
                        </p>
                        <p className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                          Total: ${order.total}
                        </p>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Package className="w-4 h-4 mr-2 text-gray-500" />
                          Ordered Products
                        </h4>
                        {order.orderedProduct.map((product, prodIndex) => (
                          <div
                            key={prodIndex}
                            className="bg-gray-50 p-3 rounded-md mb-2 last:mb-0"
                          >
                            <p className="font-medium">{product.itemName}</p>
                            <p className="text-sm text-gray-600">
                              {product.description}
                            </p>
                            <p className="text-sm">
                              Price: ${product.price} | Qty: {product.quantity}
                            </p>
                            <p className="text-sm">
                              Category: {product.category}
                            </p>
                            <div className="flex space-x-2 mt-2 overflow-x-auto">
                              {product.productImage.map((image, imgIndex) => (
                                <Image
                                  key={imgIndex}
                                  src={image}
                                  alt={product.itemName}
                                  width={80}
                                  height={80}
                                  className="rounded-md object-cover"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;

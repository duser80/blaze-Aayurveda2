import React, { useEffect, useState } from "react";
import { getOrdersBySellerID, updateDocument } from "@/src/utils/get-url";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Calendar, User, DollarSign, Truck, Eye } from "lucide-react";
import { createAWB } from "@/src/utils/ShiprocketUtils";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const GeneratAwb = async (shipment_id, courier_id, orderId) => {
    let result = await createAWB(shipment_id, courier_id);
    console.log(result);
    if (result.awb_assign_status) {
      const awbData = result.response.data;
      const updateDoc = {
        awbData,
      };
      try {
        const result = await updateDocument("Orders", orderId, updateDoc);
        toast.success("AWB generated successfully");
        fetchOrders();
      } catch (error) {
        console.log(error, "Error");
        toast.error("Error updating Order");
      }
    }
  };

  const fetchOrders = async () => {
    try {
      // Assuming the seller's ID is stored in localStorage under the key 'id'
      const sellerId = localStorage.getItem("id");
      // console.log("Retrieved seller ID:", sellerId);
      if (!sellerId) {
        console.error("Seller ID not found");
        return;
      }
      const fetchedOrders = await getOrdersBySellerID("Orders", sellerId);
      // console.log("Fetched orders:", fetchedOrders);

      setOrders(fetchedOrders.reverse());
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };
  useEffect(() => {
    console.log("Component mounted, fetching orders...");

    fetchOrders();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp, 10)).toLocaleDateString();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-500" />
                <span className="font-semibold text-sm">
                  Order #{order._id.slice(-6)}
                </span>
              </div>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  order.shiprocketOrder.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.shiprocketOrder.status === "Shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.shiprocketOrder.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>{formatDate(order.timestamp)}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  {order.address.firstName} {order.address.lastName}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                <span>Subtotal: ${order.subtotal}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                <span>Total: ${order.total}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => router.push(`seller/orderDetail/${order._id}`)}
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              {!order?.awbData && (
                <button
                  onClick={() => {
                    /* Add shipping logic here */
                    GeneratAwb(
                      order.shiprocketOrder.shipment_id,
                      order.deliveryPartnerDetails.courier_company_id,
                      order._id
                    );
                  }}
                  className="flex items-center justify-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition duration-300 ease-in-out"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Generate AWB
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {orders.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <Package className="w-16 h-16 mx-auto mb-4" />
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
};

export default Orders;

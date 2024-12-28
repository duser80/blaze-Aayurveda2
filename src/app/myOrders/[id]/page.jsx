"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clipboard } from "lucide-react";
import { getOrderDetails } from "@/src/utils/get-url";
import Link from "next/link";
import { downloadInvoiceServer } from "@/src/utils/ShiprocketUtils";

const OrderDetailPage = (props) => {
  console.log(props.params.id);
  const [orderId, setOrderId] = useState(null);

  const [order, setOrder] = useState(null); // State to hold order data

  useEffect(() => {
    setOrderId(props.params.id);
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Dummy data for demonstration
        // const dummyOrder = {
        //   _id: "667f12c1453e0c8f94266a9d",
        //   userId: "667f0a98af97a20c0270e984",
        //   orderedProduct: [
        //     {
        //       category: "private",
        //       description: "Chikna Kar denge",
        //       itemName: "Priyansh Gupta Ka Ainak 100000",
        //       nFTLink: "N.A.",
        //       paymentMethod: "online",
        //       price: "100",
        //       productImage: [Array],
        //       quantity: 15,
        //       sellerId: "667f0a98af97a20c0270e984",
        //       productId: "667f125a453e0c8f94266a9c",
        //     },
        //   ],
        //   subtotal: 1500,
        //   shippingEstimate: 200,
        //   tax: 270,
        //   total: 1970,
        //   phoneNumber: "+911234567890",
        //   email: "pg167783@gmail.com",
        //   address: {
        //     firstName: "jphn",
        //     lastName: "doe",
        //     addressLine: "Ram Nagar",
        //     houseNumber: "34D",
        //     city: "Indore",
        //     country: "United States",
        //     state: "Rajasthan",
        //     zipCode: "414000",
        //     type: "Address-type-home",
        //   },
        //   paymentDetails: {
        //     razorpay_payment_id: "pay_OSIhzkNwju5OH7",
        //     razorpay_order_id: "order_OSIhrnwZQ9S4HE",
        //     razorpay_signature:
        //       "9fdcb67a74d7661b4e8bfed0050bf02e21debcc5b61fdc8faba6c0edea5962cd",
        //   },
        //   shiprocketOrder: {
        //     order_id: 578057725,
        //     channel_order_id: "order_OSIhrnwZQ9S4HE",
        //     shipment_id: 576122048,
        //     status: "NEW",
        //     status_code: 1,
        //     onboarding_completed_now: 0,
        //     awb_code: "",
        //     courier_company_id: "",
        //     courier_name: "",
        //     new_channel: false,
        //     packaging_box_error: "",
        //   },
        //   timestamp: "1719603905474",
        // };
        // setOrder(dummyOrder);
        const data = await getOrderDetails(orderId);
        console.log(data, "Data");
        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <div className="text-white">Loading...</div>;
  }

  const getInvoiceURL = async (id) => {
    let data = await downloadInvoiceServer(id);
    console.log(data);
    window.open(data.invoice_url, "_blank", "noopener,noreferrer");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("AWB Code copied to clipboard!");
    });
  };

  return (
    <div className="bg-white min-h-screen p-4 text-gray-800">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          {/* <ArrowLeft className="h-6 w-6 text-gray-500 mr-4" /> */}
          <h1 className="text-2xl font-bold">Order Summary</h1>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-semibold">Order ID</p>
              <p>{order._id}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Total</p>
              <p className="text-orange-500 font-bold">₹{order.total}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold">Placed on</p>
            <p>
              {new Date(parseInt(order.timestamp)).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="font-semibold mb-2">
            {order.orderedProduct.length} item(s)
          </p>
          <p className="text-gray-600 mb-4">
            Package is expected to arrive by {order.deliveryPartnerDetails.etd}
          </p>

          <div className="space-y-4">
            {order?.awbData ? (
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                <span>AWB Code Generated {order.awbData.awb_code}</span>
                <button
                  className="ml-2 text-blue-500"
                  onClick={() => copyToClipboard(order.awbData.awb_code)}
                >
                  <Clipboard className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="h-6 w-6 bg-orange-500 rounded-full mr-2" />
                <span>AWB Code will generate soon</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-4">Product Details</h2>
          {order.orderedProduct.map((product, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Image
                src={product.productImage[0]}
                alt={product.itemName}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div>
                <h3 className="font-semibold">{product.itemName}</h3>
                <p>Qty: {product.quantity}</p>
                <p className="text-orange-500 font-bold">
                  ₹{product.price * product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">Shipping address</h2>
          <p>
            {order.address.firstName} {order.address.lastName}
          </p>
          <p>
            {order.address.houseNumber}, {order.address.addressLine}
          </p>
          <p>
            {order.address.city}, {order.address.state} {order.address.zipCode}
          </p>
          <p>{order.address.country}</p>
          <p>{order.phoneNumber}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-4">Price Details</h2>
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

        <button
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold"
          onClick={() => {
            getInvoiceURL(order.shiprocketOrder.order_id);
          }}
        >
          Download Invoice
        </button>
      </div>
    </div>
    // <div className="bg-gray-900 text-white min-h-screen p-4">
    //   <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
    //     <h1 className="text-2xl sm:text-3xl font-bold">Order Details</h1>
    //     <div>
    //       <h2 className="text-lg sm:text-xl font-semibold">
    //         Order ID: {order?._id}
    //       </h2>
    //     </div>
    //     <div>
    //       <h2 className="text-lg sm:text-xl font-semibold">Ordered Products</h2>
    //       {order?.orderedProduct.map((product, index) => (
    //         <div
    //           key={index}
    //           className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 my-2"
    //         >
    //           <div className="relative h-20 w-20 flex-shrink-0">
    //             <Image
    //               src={product.productImage[0]} // Assuming the first image in the array
    //               alt={product.itemName}
    //               layout="fill"
    //               objectFit="contain"
    //               className="rounded-lg"
    //             />
    //           </div>
    //           <div className="flex flex-col sm:flex-row justify-between w-full">
    //             <Link href={`/marketplace/${product?.productId}`}>
    //               <h3 className="text-blue-500 text-md sm:text-lg font-semibold">
    //                 {product.itemName}
    //               </h3>
    //             </Link>
    //             <p>Quantity: {product.quantity}</p>
    //             <p>Price: ${product.price}</p>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //     <div>
    //       <h2 className="text-lg sm:text-xl font-semibold">Shipping Address</h2>
    //       <p>
    //         {order?.address.firstName} {order?.address.lastName}
    //       </p>
    //       <p>
    //         {order?.address.houseNumber}, {order?.address.addressLine}
    //       </p>
    //       <p>
    //         {order?.address.city}, {order?.address.state},{" "}
    //         {order?.address.zipCode}
    //       </p>
    //       <p>{order?.address.country}</p>
    //     </div>
    //     <div>
    //       <h2 className="text-lg sm:text-xl font-semibold">Contact Details</h2>
    //       <p>Phone: {order?.phoneNumber}</p>
    //       <p>Email: {order?.email}</p>
    //     </div>
    //     <div>
    //       <h2 className="text-lg sm:text-xl font-semibold">Payment Details</h2>
    //       <p>Payment ID: {order?.paymentDetails?.razorpay_payment_id}</p>
    //       <p>Order ID: {order?.paymentDetails?.razorpay_order_id}</p>
    //     </div>
    //     <div>
    //       <h2 className="text-lg sm:text-xl font-semibold">Order Summary</h2>
    //       <p>Subtotal: ${order?.subtotal}</p>
    //       <p>Shipping Estimate: ${order?.shippingEstimate}</p>
    //       <p>Tax: ${order?.tax}</p>
    //       <p>Total: ${order?.total}</p>
    //     </div>
    //     <div>
    //       <h2 className="text-lg sm:text-xl font-semibold">Tracking Details</h2>
    //       <p>Status: {order?.shiprocketOrder.status}</p>
    //       <p>Shipment ID: {order?.shiprocketOrder.shipment_id}</p>
    //     </div>
    //   </div>
    // </div>
  );
};

export default OrderDetailPage;

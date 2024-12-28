import React from "react";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

const OrderConfirmation = () => {
  return (
    <div className="bg-white min-h-screen p-4 flex flex-col justify-center mt-[-50px]">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl text-center font-bold flex-grow text-green-700">
          Congratulations
        </h1>
      </div>

      <h2 className="text-xl font-semibold text-center mb-6">
        Thank you for choosing organic product over those garbage.
      </h2>

      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={64} color="white" />
        </div>
      </div>

      <div className="space-y-4">
        <Link href="/myOrders" className="block">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-lg text-gray-700">View Your Order</span>
            <ChevronRight size={24} className="text-gray-400" />
          </div>
        </Link>
        <Link href="/" className="block">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-lg text-gray-700">Home Page</span>
            <ChevronRight size={24} className="text-gray-400" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

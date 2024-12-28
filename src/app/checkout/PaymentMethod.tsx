"use client";

import Label from "@/src/components/Label/Label";
import React, { FC, useState } from "react";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/src/shared/Button/ButtonSecondary";
import Input from "@/src/shared/Input/Input";
import { ChevronRight, Globe, CreditCard } from "lucide-react";
import Radio from "@/src/shared/Radio/Radio";
import { BanknotesIcon } from "@heroicons/react/24/outline";

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
  setPaymentMethod: (value: string) => void;
}

const PaymentMethod: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  setPaymentMethod,
}) => {
  const [methodActive, setMethodActive] = useState<
    "Internet-banking" | "Wallet"
  >("Internet-banking");

  // const renderInterNetBanking = () => {
  //   const active = mothodActive === "Internet-banking";
  //   return (
  //     <div className="flex items-start space-x-4 sm:space-x-6">
  //       <Radio
  //         className="pt-3.5"
  //         name="payment-method"
  //         id="Internet-banking"
  //         defaultChecked={active}
  //         onChange={(e) => {
  //           setMethodActive(e as any);
  //           setPaymentMethod("razorpay");
  //         }}
  //       />
  //       <div className="flex-1">
  //         <label
  //           htmlFor="Internet-banking"
  //           className="flex items-center space-x-4 sm:space-x-6"
  //         >
  //           <div
  //             className={`p-2.5 rounded-xl border-2 ${
  //               active
  //                 ? "border-slate-600 dark:border-slate-300"
  //                 : "border-gray-200 dark:border-slate-600"
  //             }`}
  //           >
  //             <svg
  //               className="w-6 h-6 sm:w-7 sm:h-7"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
  //                 stroke="currentColor"
  //                 strokeWidth="1.5"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //               <path
  //                 d="M7.99998 3H8.99998C7.04998 8.84 7.04998 15.16 8.99998 21H7.99998"
  //                 stroke="currentColor"
  //                 strokeWidth="1.5"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //               <path
  //                 d="M15 3C16.95 8.84 16.95 15.16 15 21"
  //                 stroke="currentColor"
  //                 strokeWidth="1.5"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //               <path
  //                 d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
  //                 stroke="currentColor"
  //                 strokeWidth="1.5"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //               <path
  //                 d="M3 9.0001C8.84 7.0501 15.16 7.0501 21 9.0001"
  //                 stroke="currentColor"
  //                 strokeWidth="1.5"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //             </svg>
  //           </div>
  //           <p className="font-medium">RazorPay</p>
  //         </label>
  //       </div>
  //     </div>
  //   );
  // };

  // const renderWallet = () => {
  //   const active = mothodActive === "Wallet";
  //   return (
  //     <div className="flex items-start space-x-4 sm:space-x-6">
  //       <Radio
  //         className="pt-3.5"
  //         name="payment-method"
  //         id="Wallet"
  //         defaultChecked={active}
  //         onChange={(e) => {
  //           setMethodActive(e as any);
  //           setPaymentMethod("cod");
  //         }}
  //       />
  //       <div className="flex-1">
  //         <label
  //           htmlFor="Wallet"
  //           className="flex items-center space-x-4 sm:space-x-6 "
  //         >
  //           <div
  //             className={`p-2.5 rounded-xl border-2 ${
  //               active
  //                 ? "border-slate-600 dark:border-slate-300"
  //                 : "border-gray-200 dark:border-slate-600"
  //             }`}
  //           >
  //             <svg
  //               className="w-6 h-6 sm:w-7 sm:h-7"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //             >
  //               <BanknotesIcon className="h-5 w-5" />
  //             </svg>
  //           </div>
  //           <p className="font-medium">Cash On Delivery</p>
  //         </label>
  //         <div className={`mt-6 mb-4 space-y-6 ${active ? "block" : "hidden"}`}>
  //           <div className="text-sm prose dark:prose-invert">
  //             <p className=" text-red-500">
  //               ₹50 Extra Charges On Cash On Delivery
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const renderPaymentMethod = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div
          className="p-4 flex justify-between items-center"
          onClick={onOpenActive}
        >
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full p-2 mr-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Payment Method</h3>
              <p className="text-sm text-gray-600">
                {methodActive === "Internet-banking"
                  ? "RazorPay"
                  : "Cash On Delivery"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {isActive && (
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment-method"
                  value="Internet-banking"
                  checked={methodActive === "Internet-banking"}
                  onChange={() => {
                    setMethodActive("Internet-banking");
                    setPaymentMethod("razorpay");
                  }}
                  className="form-radio h-4 w-4 text-green-600"
                />
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-medium text-sm">RazorPay</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment-method"
                  value="Wallet"
                  checked={methodActive === "Wallet"}
                  onChange={() => {
                    setMethodActive("Wallet");
                    setPaymentMethod("cod");
                  }}
                  className="form-radio h-4 w-4 text-green-600"
                />
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-medium text-sm">Cash On Delivery</span>
                </div>
              </label>

              {methodActive === "Wallet" && (
                <p className="text-sm text-red-500 mt-2">
                  ₹50 Extra Charges On Cash On Delivery
                </p>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded-full font-medium text-sm"
                onClick={onCloseActive}
              >
                Confirm Payment Method
              </button>
              <button
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-full font-medium text-sm"
                onClick={onCloseActive}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      // <div className="border border-slate-200 dark:border-slate-700 rounded-xl ">
      //   <div className="p-6 flex flex-col sm:flex-row items-start">
      //     <span className="hidden sm:block">
      //       <svg
      //         className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
      //         viewBox="0 0 24 24"
      //         fill="none"
      //         xmlns="http://www.w3.org/2000/svg"
      //       >
      //         <path
      //           d="M3.92969 15.8792L15.8797 3.9292"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeMiterlimit="10"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M11.1013 18.2791L12.3013 17.0791"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeMiterlimit="10"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M13.793 15.5887L16.183 13.1987"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeMiterlimit="10"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M2 21.9985H22"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //       </svg>
      //     </span>
      //     <div className="sm:ml-8">
      //       <h3 className=" text-slate-700 dark:text-slate-400 flex ">
      //         <span className="uppercase tracking-tight">PAYMENT METHOD</span>
      //         <svg
      //           fill="none"
      //           viewBox="0 0 24 24"
      //           strokeWidth="2.5"
      //           stroke="currentColor"
      //           className="w-5 h-5 ml-3 text-slate-900"
      //         >
      //           <path
      //             strokeLinecap="round"
      //             strokeLinejoin="round"
      //             d="M4.5 12.75l6 6 9-13.5"
      //           />
      //         </svg>
      //       </h3>
      //       <div className="font-semibold mt-1 text-sm">
      //         <span className="">RazorPay / Cash On Delivery</span>
      //       </div>
      //     </div>
      //     <button
      //       className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
      //       onClick={onOpenActive}
      //     >
      //       Change
      //     </button>
      //   </div>

      //   <div
      //     className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-6 ${
      //       isActive ? "block" : "hidden"
      //     }`}
      //   >
      //     {/* ==================== */}
      //     <div>{renderInterNetBanking()}</div>

      //     {/* ==================== */}
      //     <div>{renderWallet()}</div>

      //     <div className="flex pt-6">
      //       <ButtonPrimary
      //         className="w-full max-w-[240px]"
      //         onClick={onCloseActive}
      //       >
      //         Confirm order
      //       </ButtonPrimary>
      //       <ButtonSecondary className="ml-3" onClick={onCloseActive}>
      //         Cancel
      //       </ButtonSecondary>
      //     </div>
      //   </div>
      // </div>
    );
  };

  return renderPaymentMethod();
};

export default PaymentMethod;

import Label from "@/src/components/Label/Label";
import React, { FC, useState } from "react";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/src/shared/Button/ButtonSecondary";
import Checkbox from "@/src/shared/Checkbox/Checkbox";
import Input from "@/src/shared/Input/Input";
import { updateDocument } from "@/src/utils/get-url";
import { toast } from "react-toastify";
import { ChevronRight, Phone, Mail, Check } from "lucide-react";

interface Props {
  isActive: boolean;
  userData: any;
  onOpenActive: () => void;
  onCloseActive: () => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

const ContactInfo: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  userData,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
}) => {
  const [phoneError, setPhoneError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const phoneRegex = /^\+?[1-9]\d{9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setPhoneNumber(value);
    if (!phoneRegex.test(value)) {
      setPhoneError("Please enter a valid phone number");
    } else {
      setPhoneError("");
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const renderAccount = () => {
    return (
      // <div className="border border-slate-700 rounded-xl overflow-hidden z-0">
      //   <div className="flex flex-col sm:flex-row items-start p-6 ">
      //     <span className="hidden sm:block">
      //       <svg
      //         className="w-6 h-6 xtext-slate-400 mt-0.5"
      //         viewBox="0 0 24 24"
      //         fill="none"
      //         xmlns="http://www.w3.org/2000/svg"
      //       >
      //         <path
      //           d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //       </svg>
      //     </span>
      //     <div className="sm:ml-8">
      //       <h3 className=" text-slate-300 flex ">
      //         <span className="uppercase tracking-tight">CONTACT INFO</span>
      //         <svg
      //           fill="none"
      //           viewBox="0 0 24 24"
      //           strokeWidth="2.5"
      //           stroke="currentColor"
      //           className="w-5 h-5 ml-3 text-slate-100 "
      //         >
      //           <path
      //             strokeLinecap="round"
      //             strokeLinejoin="round"
      //             d="M4.5 12.75l6 6 9-13.5"
      //           />
      //         </svg>
      //       </h3>
      //       <div className="font-semibold mt-1 text-sm">
      //         <span className="">{userData?.name}</span>
      //         <span className="ml-3 tracking-tighter">{phoneNumber}</span>
      //       </div>
      //     </div>
      //     <button
      //       className="py-2 px-4 bg-slate-800 hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
      //       onClick={() => onOpenActive()}
      //     >
      //       Change
      //     </button>
      //   </div>
      //   <div
      //     className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${
      //       isActive ? "block" : "hidden"
      //     }`}
      //   >
      //     <div className="flex justify-between flex-wrap items-baseline">
      //       <h3 className="text-lg font-semibold">Contact infomation</h3>
      //     </div>
      //     <div className="max-w-lg">
      //       <Label className="text-sm">Your phone number</Label>
      //       <Input
      //         className="mt-1.5"
      //         value={phoneNumber}
      //         onChange={handlePhoneNumberChange}
      //         type={"tel"}
      //         placeholder="+919876543210"
      //       />
      //     </div>
      //     <div className="max-w-lg">
      //       <Label className="text-sm">Email address</Label>
      //       <Input
      //         className="mt-1.5"
      //         value={email}
      //         onChange={handleEmailChange}
      //         type={"email"}
      //         placeholder="versejack@gmail.com"
      //       />
      //     </div>
      //     <div>
      //       <Checkbox
      //         className="!text-sm"
      //         name="uudai"
      //         label="Email me news and offers"
      //         defaultChecked
      //       />
      //     </div>

      //     {/* ============ */}
      //     <div className="flex flex-col sm:flex-row pt-6">
      //       <ButtonPrimary
      //         className="sm:!px-7 shadow-none"
      //         onClick={() => {
      //           handleOnSave();
      //         }}
      //       >
      //         Save and next to Shipping
      //       </ButtonPrimary>
      //       <ButtonSecondary
      //         className="mt-3 sm:mt-0 sm:ml-3"
      //         onClick={() => onCloseActive()}
      //       >
      //         Cancel
      //       </ButtonSecondary>
      //     </div>
      //   </div>
      // </div>
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div
          className="p-4 flex justify-between items-center"
          onClick={onOpenActive}
        >
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full p-2 mr-3">
              <Phone className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Contact Info</h3>
              <p className="text-sm text-gray-600">
                {phoneNumber || "Add phone number"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {isActive && (
          <div className="p-4 border-t border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  phoneError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="9876543210"
              />
              {phoneError && (
                <p className="mt-1 text-xs text-red-500">{phoneError}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="example@email.com"
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-500">{emailError}</p>
              )}
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="newsOffers"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="newsOffers"
                className="ml-2 block text-sm text-gray-700"
              >
                Email me news and offers
              </label>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleOnSave}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-full font-medium text-sm"
              >
                Save Changes
              </button>
              <button
                onClick={onCloseActive}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-full font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleOnSave = async () => {
    if (phoneNumber == "" || !phoneNumber) {
      setPhoneError("Please enter a phone number");
      return;
    }

    if (email == "" || !email) {
      setEmailError("Please enter an email address");
      return;
    }

    if (phoneError || emailError) {
      toast.error("Please correct the errors before saving");
      return;
    }

    if (phoneNumber === userData?.mobile && email === userData?.email) {
      console.log("No changes required");
      onCloseActive();
      return;
    }

    const id = localStorage.getItem("id");
    if (id === null) {
      console.error("User ID is null");
      toast.error("Please login first");
      return;
    }

    let data = {
      mobile: phoneNumber,
      email: email,
    };

    try {
      // const result = await updateDocument("user", id, {
      //   mobile: phoneNumber,
      //   email: email,
      // });
      const result = await updateDocument("user", id, data);
      console.log(`Updated ${result} document(s)`);
      toast.success("Contact information updated successfully");
      onCloseActive();
    } catch (error) {
      console.error("Error updating contact info:", error);
      toast.error("Failed to update contact information");
    }
  };

  return renderAccount();
};

export default ContactInfo;

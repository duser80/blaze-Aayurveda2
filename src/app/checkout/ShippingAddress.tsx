"use client";

import Label from "@/src/components/Label/Label";
import React, { FC } from "react";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/src/shared/Button/ButtonSecondary";
import Input from "@/src/shared/Input/Input";
import Radio from "@/src/shared/Radio/Radio";
import Select from "@/src/shared/Select/Select";
import { updateDocument } from "@/src/utils/get-url";
import { toast } from "react-toastify";
import { ChevronRight, MapPin, Home, Briefcase } from "lucide-react";

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
  confirmOrder: () => boolean;
  userData: any;
  address: Address;
  setAddress: (value: Address) => void;
}

interface Address {
  firstName: string;
  lastName: string;
  addressLine: string;
  houseNumber: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  type: string; // can be house or office
}

const ShippingAddress: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  userData,
  address,
  setAddress,
  confirmOrder,
}) => {
  const renderShippingAddress = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div
          className="p-4 flex justify-between items-center"
          onClick={onOpenActive}
        >
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full p-2 mr-3">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {address?.houseNumber
                  ? `${address.houseNumber}, ${address.addressLine}`
                  : "Add address"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {isActive && (
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={address?.firstName}
                  onChange={(e) =>
                    setAddress({ ...address, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={address?.lastName}
                  onChange={(e) =>
                    setAddress({ ...address, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line
              </label>
              <input
                type="text"
                value={address?.addressLine}
                onChange={(e) =>
                  setAddress({ ...address, addressLine: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="123 Main St"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apt, Suite, etc.
              </label>
              <input
                type="text"
                value={address?.houseNumber}
                onChange={(e) =>
                  setAddress({ ...address, houseNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Apt 4B"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={address?.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={address?.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="NY"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={address?.zipCode}
                  onChange={(e) =>
                    setAddress({ ...address, zipCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={address?.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select</option>
                  <option value="India">India</option>
                  {/* <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Israel">Israel</option>
                  <option value="France">France</option>
                  <option value="England">England</option>
                  <option value="Laos">Laos</option>
                  <option value="China">China</option> */}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    value="Address-type-home"
                    checked={address?.type === "Address-type-home"}
                    onChange={(e) =>
                      setAddress({ ...address, type: e.target.value })
                    }
                    className="form-radio h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Home</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    value="Address-type-office"
                    checked={address?.type === "Address-type-office"}
                    onChange={(e) =>
                      setAddress({ ...address, type: e.target.value })
                    }
                    className="form-radio h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Office</span>
                </label>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleOnSave}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-full font-medium text-sm"
              >
                Save Address
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
      // <div className="border border-slate-700 rounded-xl ">
      //   <div className="p-6 flex flex-col sm:flex-row items-start">
      //     <span className="hidden sm:block">
      //       <svg
      //         className="w-6 h-6 text-slate-400 mt-0.5"
      //         viewBox="0 0 24 24"
      //         fill="none"
      //         xmlns="http://www.w3.org/2000/svg"
      //       >
      //         <path
      //           d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //         <path
      //           d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      //           stroke="currentColor"
      //           strokeWidth="1.5"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         />
      //       </svg>
      //     </span>

      //     <div className="sm:ml-8">
      //       <h3 className=" text-slate-300 flex ">
      //         <span className="uppercase">SHIPPING ADDRESS</span>
      //         <svg
      //           fill="none"
      //           viewBox="0 0 24 24"
      //           strokeWidth="2.5"
      //           stroke="currentColor"
      //           className="w-5 h-5 ml-3 text-slate-100"
      //         >
      //           <path
      //             strokeLinecap="round"
      //             strokeLinejoin="round"
      //             d="M4.5 12.75l6 6 9-13.5"
      //           />
      //         </svg>
      //       </h3>
      //       <div className="font-semibold mt-1 text-sm">
      //         <span className="">
      //           {address?.houseNumber
      //             ? address?.houseNumber + address?.addressLine
      //             : ""}
      //         </span>
      //       </div>
      //     </div>
      //     <button
      //       className="py-2 px-4 bg-slate-800 hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
      //       onClick={onOpenActive}
      //     >
      //       Change
      //     </button>
      //   </div>
      //   <div
      //     className={`border-t border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${
      //       isActive ? "block" : "hidden"
      //     }`}
      //   >
      //     {/* ============ */}
      //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
      //       <div>
      //         <Label className="text-sm">First name</Label>
      //         <Input
      //           className="mt-1.5"
      //           value={address?.firstName}
      //           onChange={(e) =>
      //             setAddress({ ...address, firstName: e.target.value })
      //           }
      //           type={"first name"}
      //           placeholder="John"
      //         />
      //       </div>
      //       <div>
      //         <Label className="text-sm">Last name</Label>
      //         <Input
      //           className="mt-1.5"
      //           value={address?.lastName}
      //           onChange={(e) =>
      //             setAddress({ ...address, lastName: e.target.value })
      //           }
      //           type={"last name"}
      //           placeholder="Doe"
      //         />
      //       </div>
      //     </div>

      //     {/* ============ */}
      //     <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
      //       <div className="flex-1">
      //         <Label className="text-sm">Address Line 1</Label>
      //         <Input
      //           className="mt-1.5"
      //           value={address?.addressLine}
      //           onChange={(e) =>
      //             setAddress({ ...address, addressLine: e.target.value })
      //           }
      //           type={"address line"}
      //           placeholder="Ram Nagar, Near Rajawat Square"
      //         />
      //       </div>
      //       <div className="sm:w-1/3">
      //         <Label className="text-sm">Apt, Suite, *</Label>
      //         <Input
      //           className="mt-1.5"
      //           value={address?.houseNumber}
      //           onChange={(e) =>
      //             setAddress({ ...address, houseNumber: e.target.value })
      //           }
      //           type={"text"}
      //           placeholder="34D"
      //         />
      //       </div>
      //     </div>

      //     {/* ============ */}
      //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
      //       <div>
      //         <Label className="text-sm">City</Label>
      //         <Input
      //           className="mt-1.5"
      //           value={address?.city}
      //           onChange={(e) =>
      //             setAddress({ ...address, city: e.target.value })
      //           }
      //           type={"city"}
      //           placeholder="Indore"
      //         />
      //       </div>
      //       <div>
      //         <Label className="text-sm">Country</Label>
      //         <Select
      //           className="mt-1.5"
      //           value={address?.country}
      //           onChange={(e) =>
      //             setAddress({ ...address, country: e.target.value })
      //           }
      //         >
      //           <option value="">Select</option>
      //           <option value="India">India</option>
      //           <option value="United States">United States</option>
      //           <option value="Canada">Canada</option>
      //           <option value="Mexico">Mexico</option>
      //           <option value="Israel">Israel</option>
      //           <option value="France">France</option>
      //           <option value="England">England</option>
      //           <option value="Laos">Laos</option>
      //           <option value="China">China</option>
      //         </Select>
      //       </div>
      //     </div>

      //     {/* ============ */}
      //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
      //       <div>
      //         <Label className="text-sm">State/Province</Label>
      //         <Input
      //           className="mt-1.5"
      //           value={address?.state}
      //           onChange={(e) =>
      //             setAddress({ ...address, state: e.target.value })
      //           }
      //           type={"state"}
      //           placeholder="Rajasthan"
      //         />
      //       </div>
      //       <div>
      //         <Label className="text-sm">Postal code</Label>
      //         <Input
      //           className="mt-1.5"
      //           value={address?.zipCode}
      //           onChange={(e) =>
      //             setAddress({ ...address, zipCode: e.target.value })
      //           }
      //           type={"zip"}
      //           placeholder="414000"
      //         />
      //       </div>
      //     </div>

      //     {/* ============ */}
      //     <div>
      //       <Label className="text-sm">Address type</Label>
      //       <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      //         <Radio
      //           label={`<span class="text-sm font-medium">Home <span class="font-light">(All Day Delivery)</span></span>`}
      //           id="Address-type-home"
      //           name="Address-type"
      //           defaultChecked={address?.type === "Address-type-home"}
      //           onChange={(value) => {
      //             setAddress({ ...address, type: value });
      //           }}
      //         />
      //         <Radio
      //           label={`<span class="text-sm font-medium">Office <span class="font-light">(Delivery <span class="font-medium">9 AM - 5 PM</span>)</span> </span>`}
      //           id="Address-type-office"
      //           name="Address-type"
      //           defaultChecked={address?.type === "Address-type-office"}
      //           onChange={(value) => {
      //             setAddress({ ...address, type: value });
      //           }}
      //         />
      //       </div>
      //     </div>

      //     {/* ============ */}
      //     <div className="flex flex-col sm:flex-row pt-6">
      //       <ButtonPrimary
      //         className="sm:!px-7 shadow-none"
      //         onClick={() => {
      //           handleOnSave();
      //         }}
      //       >
      //         Save
      //       </ButtonPrimary>
      //       <ButtonSecondary
      //         className="mt-3 sm:mt-0 sm:ml-3"
      //         onClick={onCloseActive}
      //       >
      //         Cancel
      //       </ButtonSecondary>
      //     </div>
      //   </div>
      // </div>
    );
  };

  const handleOnSave = async () => {
    if (address === userData?.address) {
      console.log("Same No change required");
      if (confirmOrder()) {
        onCloseActive();
      }
    } else {
      console.log(address, "Updated address");
      const id = localStorage.getItem("id"); // Get user ID from local storage
      if (id === null) {
        console.error("User ID is null");
        toast.error("Please login first");
        return;
      }
      const result = await updateDocument("user", id, { address });
      console.log(`Updated ${result} document(s)`);
      if (confirmOrder()) {
        onCloseActive();
      }
    }
    // onCloseActive();
  };

  {
    /*
    if (phoneNumber === userData?.mobile) {
      console.log("Same No change required");
      onCloseActive();
    } else {
      console.log("Phone number changed");
      const id = localStorage.getItem("id"); // Get user ID from local storage
      if (id === null) {
        console.error("User ID is null");
        toast.error("Please login first");
        return;
      }
      const result = await updateDocument("user", id, { mobile: phoneNumber });
      console.log(`Updated ${result} document(s)`);
      onCloseActive();
    }
    */
  }

  return renderShippingAddress();
};

export default ShippingAddress;

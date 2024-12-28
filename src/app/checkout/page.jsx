"use client";

import Label from "@/src/components/Label/Label";
import NcInputNumber from "@/src/components/NcInputNumber";
import Prices from "@/src/components/Prices";
import { Product, PRODUCTS } from "@/src/data/data";
import { useState, useEffect } from "react";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import {
  ChevronLeft,
  Minus,
  Plus,
  Heart,
  Share2,
  ChevronDown,
  X,
} from "lucide-react";
import Input from "@/src/shared/Input/Input";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  createShipRocketOrderServer,
  isServiceable,
} from "../../utils/ShiprocketUtils";
import {
  getUserCartData,
  addToCartProduct,
  getUserData,
  updateDocument,
  placingOrder,
  createRazorPayOrder,
  ApplyCoupon,
} from "@/src/utils/get-url";
import ConfirmationPopup from "@/src/components/ConfirmationPopup";

const CheckoutPage = () => {
  const router = useRouter();

  const [cartData, setCartData] = useState([]);
  const [removeCart, setRemoveCart] = useState(null);
  const [tabActive, setTabActive] = useState("ContactInfo"); //ContactInfo, ShippingAddress,PaymentMethod
  const [cartUpdated, setCartUpdated] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingEstimate, setShippingEstimate] = useState(0);
  const [taxEstimate, setTaxEstimate] = useState(0);
  const [total, setTotal] = useState(0);
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [options, setOptions] = useState({ fastest: null, leastCost: null });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    addressLine: "",
    houseNumber: "",
    city: "",
    country: "",
    state: "",
    zipCode: "",
    type: "",
  });
  const [selectedOption, setSelectedOption] = useState(); // Default to 'fastest'
  const [parcelPhysics, setParcelPhysics] = useState({
    length: 0,
    breadth: 0,
    height: 0,
    weight: 0,
  });

  // Step 3: Create Click Handler
  const handleOptionSelect = (option) => {
    console.log(options, "Options");
    setSelectedOption(option);
    // Update shipping estimate based on selection
    const shippingCost =
      option === "fastest"
        ? Math.floor(options.fastest?.rate - options.leastCost?.rate)
        : 0;
    setShippingEstimate(shippingCost);
  };

  const handleConfirmYes = () => {
    setIsConfirmationOpen(false);
    if (paymentMethod === "cod") {
      handlePlaceOrderOnCOD();
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id"); // Get user ID from local storage
      const user = await getUserData(id); // replace 'users' with your collection name
      if (user) {
        // const user = data[4]; // assuming the first document is the user's data
        // const user = data.find(doc => doc.id === id); // Find the user's data by ID

        console.log(user, "user");
        setUserData(user);
        if (user?.mobile && user?.email) {
          setPhoneNumber(user?.mobile);
          setEmail(user?.email);
          setTabActive("ShippingAddress");
        }
        if (user?.address) {
          setAddress(user?.address); // Set the user's address
          if (user?.address?.zipCode) {
            setTabActive("PaymentMethod");
          }
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    calcPhysics();
  }, [cartData]);

  useEffect(() => {
    if (parcelPhysics.weight == 0) {
      return;
    }
    if (address?.zipCode) {
      DeliveryOptions(address?.zipCode);
    }
  }, [parcelPhysics, paymentMethod]);

  const calcPhysics = () => {
    console.log("Hello In physics");
    let length = 0;
    let breadth = 0;
    let height = 0;
    let weight = 0;
    console.log(cartData, "Cart Dat");
    cartData.forEach((item) => {
      const qty = item.quantity || 1;
      height += (item?.physics?.height || 0) * qty;
      weight += (item?.physics?.weight || 0) * qty;
      if (length < item?.physics?.length) {
        length = item?.physics?.length;
      }
      if (breadth < item?.physics?.breadth) {
        breadth = item?.physics?.breadth;
      }
    });
    console.log({ length, breadth, height, weight }, "Calculate Physics");

    setParcelPhysics({ length, breadth, height, weight });
  };

  const DeliveryOptions = async (zipCode) => {
    let data = await isServiceable(
      zipCode,
      paymentMethod == "cod" ? 1 : 0,
      parcelPhysics.length,
      parcelPhysics.breadth,
      parcelPhysics.height,
      parcelPhysics.weight / 1000
    );
    console.log(data, "isServiceable");
    // Filter out non-deliverable options
    const deliverableOptions = data.data.available_courier_companies.filter(
      (company) => company.rate && company.estimated_delivery_days
    );

    if (deliverableOptions.length > 0) {
      // Sort by fastest delivery (etd_hours) and least cost (rate)
      const fastest = [...deliverableOptions].sort(
        (a, b) => a.etd_hours - b.etd_hours
      )[0];
      const leastCost = [...deliverableOptions].sort(
        (a, b) => a.rate - b.rate
      )[0];
      console.log(fastest, "Fastest");
      console.log(leastCost, "Least Cost");
      console.log(parcelPhysics, "Physics");
      console.log(fastest.rate, leastCost.rate);
      setOptions({ fastest, leastCost });
    }
  };

  useEffect(() => {
    handleOptionSelect(options.leastCost);
  }, [options]);

  const FunToApplyCoupon = async () => {
    console.log("Apply Coupon", coupon);
    const data = await ApplyCoupon(
      coupon,
      cartData,
      localStorage.getItem("id")
    );
    console.log(data);
    if (data.status == 200) {
      toast.success("Coupon applied successfully");
      let couponData = data.coupon;
      if (couponData.coupon_type == "Both") {
        setShippingEstimate(0);
        if (couponData?.discount_type == "Flat") {
          setDiscount(couponData.discount_amount);
        } else {
          setDiscount((subtotal * couponData.discount_amount) / 100);
        }
      } else if (couponData.coupon_type == "Free Shipping") {
        setShippingEstimate(0);
      } else {
        if (couponData?.discount_type == "Flat") {
          setDiscount(couponData.discount_amount);
        } else {
          setDiscount((subtotal * couponData.discount_amount) / 100);
        }
      }
      setCouponApplied(true);
    } else {
      toast.error(data.error);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon("");
    setCouponApplied(false);
    setDiscount(0);
    handleOptionSelect("leastCost");
  };

  const placeOrder = async (response, shiprocketOrder) => {
    const userId = localStorage.getItem("id"); // Get user ID from local storage
    const document = {
      orderedProduct: cartData,
      subtotal: subtotal,
      shippingEstimate: shippingEstimate,
      total: total,
      userId: userId,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      paymentDetails: response,
      shiprocketOrder: shiprocketOrder,
      isCOD: paymentMethod == "cod" ? true : false,
      deliveryType: selectedOption == options.leastCost ? "Free" : "Express",
      deliveryPartnerDetails: options.leastCost,
    };
    console.log(document, "order Details");
    const result = await placingOrder(document, couponApplied, coupon);
    console.log(`Updated ${result} document(s)`);
    return result;
  };

  const placeOrderCOD = async (shiprocketOrder) => {
    const userId = localStorage.getItem("id"); // Get user ID from local storage
    const document = {
      orderedProduct: cartData,
      subtotal: subtotal,
      shippingEstimate: shippingEstimate,
      total: total,
      userId: userId,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      shiprocketOrder: shiprocketOrder,
      isCOD: paymentMethod == "cod" ? true : false,
      deliveryType: selectedOption == options.leastCost ? "Free" : "Express",
      deliveryPartnerDetails: options.leastCost,
    };
    console.log(document, "order Details");
    const result = await placingOrder(document, couponApplied, coupon);
    console.log(result, "Result");
    return result;
  };

  const makePayment = async ({ amount, description }) => {
    const razorPayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
    const razorPayId = process.env.NEXT_PUBLIC_RAZORPAY_ID;

    const orderId = await createRazorPayOrder(amount, "INR"); // Generate the order ID
    console.log(orderId, "OrderId");
    var options = {
      key: razorPayId, // Enter the Key ID generated from the Dashboard
      key_secret: razorPayKey,
      name: "Blaze Ayurveda",
      currency: "INR",
      amount: amount * 100,
      description: description,
      image: "/Logo/logo.png",
      order_id: orderId.id,
      handler: async function (response) {
        // Validate payment at server - using webhooks is a better idea.
        console.log(response);
        // Call the function to create shiprocket order
        // let shiprocketOrder = await createShiprocketOrder(response, sellerIds);
        const convertedCartData = cartData.map((item) => ({
          name: item.itemName,
          sku: item._id, // Assuming _id is used as SKU
          units: item.quantity,
          selling_price: item.price.toString(),
          discount: item.discount.toString(),
        }));

        let shiprocketOrder = await createShipRocketOrderServer(
          response,
          address,
          email,
          phoneNumber,
          subtotal,
          discount,
          convertedCartData,
          paymentMethod == "cod" ? 1 : 0,
          parcelPhysics.length,
          parcelPhysics.breadth,
          parcelPhysics.height,
          parcelPhysics.weight / 1000
        );
        console.log(shiprocketOrder, "Shiprocket Order");
        // function to add order in user data and also store the order in order table
        const result = await placeOrder(response, shiprocketOrder);
        console.log(result, "Result");
        // Add a toast notification
        if (result.status == 200) {
          // Add a toast notification
          toast.success("Order placed successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          });
          // // Redirect to the homepage
          router.push("/confirmation");
        } else {
          console.log(result, "Error");
          toast.error("Something went wrong", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          });
        }
      },
      prefill: {
        name: localStorage.getItem("name"),
        email: email,
        contact: phoneNumber,
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      console.log(response, "Respone error");
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
    });
    rzp1.open();
  };

  const handlePlaceOrderOnCOD = async () => {
    const convertedCartData = cartData.map((item) => ({
      name: item.itemName,
      sku: item._id, // Assuming _id is used as SKU
      units: item.quantity,
      selling_price: item.price.toString(),
      discount: item.discount.toString(),
    }));

    let shiprocketOrder = await createShipRocketOrderServer(
      undefined,
      address,
      email,
      phoneNumber,
      subtotal,
      discount,
      convertedCartData,
      paymentMethod == "cod" ? 1 : 0,
      parcelPhysics.length,
      parcelPhysics.breadth,
      parcelPhysics.height,
      parcelPhysics.weight / 1000
    );
    console.log(shiprocketOrder, "Shiprocket Order");
    // function to add order in user data and also store the order in order table
    const result = await placeOrderCOD(shiprocketOrder);

    if (result.status == 200) {
      // Add a toast notification
      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      });
      // // Redirect to the homepage
      router.push("/confirmation");
    } else {
      console.log(result, "Error");
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      });
    }
  };

  const handleScrollToEl = (id) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleRemoveFromCart = async (productId) => {
    const id = productId;
    const user_id = localStorage.getItem("id");

    const data = await addToCartProduct(user_id, id, 0);
    console.log(data, "add_to_cart_function");
    setRemoveCart(data);

    // Add a toast notification
    toast("Cart updated!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      progress: undefined,
    });
  };

  const handleUpdateCart = async ({ id, quantity }) => {
    const user_id = localStorage.getItem("id");

    const data = await addToCartProduct(user_id, id, quantity);
    console.log(data, "add_to_cart_function");

    setCartUpdated(data);

    // Add a toast notification
    toast("Cart updated!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("id");
      if (userId) {
        const data = await getUserCartData(userId);
        console.log(data, "Cart Data");
        if (data.length > 0) {
          const totalAmount = data.reduce((total, item) => {
            return total + item.quantity * parseFloat(item.price);
          }, 0);
          setSubtotal(totalAmount);
          handleOptionSelect("leastCost");
          console.log(data, "Cart Data");
          setCartData(data);
        }
      }
    };

    fetchData();
  }, [removeCart, cartUpdated]);

  // useEffect(() => {
  //   const taxRate = 0.18; // 18%
  //   const taxAmount = (subtotal - discount) * taxRate;
  //   setTaxEstimate(taxAmount);
  // }, [subtotal, shippingEstimate, discount]);

  useEffect(() => {
    const total = subtotal + shippingEstimate - discount;
    setTotal(total);
    if (paymentMethod == "cod") {
      const newtotal = subtotal + shippingEstimate - discount + 50;
      setTotal(newtotal);
    }
  }, [subtotal, shippingEstimate, discount, paymentMethod]);

  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: newQuantity,
    }));
  };

  // const renderProduct = (item, index) => {
  //   const { _id, productImage, price, itemName, stock, quantity } = item;
  //   const newQty = quantities[_id] || quantity;

  //   return (
  //     <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
  //       <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
  //         <Image
  //           src={productImage[0]}
  //           fill
  //           alt={itemName}
  //           className="h-full w-full object-contain object-center"
  //           sizes="150px"
  //         />
  //         <Link
  //           href={`/marketplace/${_id}`}
  //           className="absolute inset-0"
  //         ></Link>
  //       </div>

  //       <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
  //         <div>
  //           <div className="flex justify-between ">
  //             <div className="flex-[1.5] ">
  //               <h3 className="text-base font-semibold">
  //                 <Link href={`/marketplace/${_id}`}>{itemName}</Link>
  //               </h3>
  //               <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-300">
  //                 <div className="flex items-center space-x-1.5">
  //                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
  //                     <path
  //                       d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeMiterlimit="10"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                     <path
  //                       d="M8.35 1.94995L9.69 3.28992"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeMiterlimit="10"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                     <path
  //                       d="M2.07 11.92L17.19 11.26"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeMiterlimit="10"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                     <path
  //                       d="M3 22H16"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeMiterlimit="10"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                     <path
  //                       d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                   </svg>

  //                   <span>{`Black`}</span>
  //                 </div>
  //                 <span className="mx-4 border-l border-slate-700 "></span>
  //                 <div className="flex items-center space-x-1.5">
  //                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
  //                     <path
  //                       d="M21 9V3H15"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                     <path
  //                       d="M3 15V21H9"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                     <path
  //                       d="M21 3L13.5 10.5"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                     <path
  //                       d="M10.5 13.5L3 21"
  //                       stroke="currentColor"
  //                       strokeWidth="1.5"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                   </svg>

  //                   <span>{`2XL`}</span>
  //                 </div>
  //               </div>

  //               <div className="mt-3 flex justify-between w-full sm:hidden relative">
  //                 <select
  //                   name="qty"
  //                   id="qty"
  //                   className="form-select text-sm rounded-md py-1 border-slate-700 relative z-10 bg-slate-800 "
  //                 >
  //                   <option value="1">1</option>
  //                   <option value="2">2</option>
  //                   <option value="3">3</option>
  //                   <option value="4">4</option>
  //                   <option value="5">5</option>
  //                   <option value="6">6</option>
  //                   <option value="7">7</option>
  //                 </select>
  //                 <Prices
  //                   contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
  //                   price={price}
  //                 />
  //               </div>
  //             </div>

  //             <div className="hidden flex-1 sm:flex justify-end">
  //               <Prices price={price} className="mt-0.5" />
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex mt-auto pt-4 items-end justify-between text-sm">
  //           <div className="hidden sm:block text-center relative">
  //             <NcInputNumber
  //               className="relative z-10"
  //               defaultValue={quantity}
  //               max={stock}
  //               onChange={(newQuantity) =>
  //                 handleQuantityChange(_id, newQuantity)
  //               }
  //             />
  //           </div>

  //           <button
  //             type="button"
  //             className="font-medium text-primary-500 "
  //             onClick={() => handleRemoveFromCart(_id)}
  //           >
  //             Remove
  //           </button>
  //           {newQty !== quantity && (
  //             <button
  //               type="button"
  //               className="font-medium text-primary-500 "
  //               onClick={() => handleUpdateCart({ id: _id, quantity: newQty })}
  //             >
  //               Update Cart
  //             </button>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }

  const renderProduct = (item) => {
    const { _id, productImage, price, itemName, stock, quantity } = item;
    const newQty = quantities[_id] || quantity;

    return (
      <div
        key={item._id}
        className="bg-white rounded-lg shadow-sm mb-4 p-4 flex"
      >
        <Image
          src={productImage[0]}
          alt={itemName}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
        <div className="ml-4 flex-1">
          <h2 className="font-semibold text-sm">
            {truncateString(itemName, 20)}
          </h2>
          <div className="flex justify-between items-center mt-2">
            <span className="text-green-600 font-bold text-sm">
              Rs {price}/-
            </span>
            <div className="flex items-center border rounded-full">
              <button
                className="px-2 py-1"
                onClick={() =>
                  handleQuantityChange(_id, Math.max(1, newQty - 1))
                }
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm">{newQty}</span>
              <button
                className="px-2 py-1"
                onClick={() => {
                  console.log("Hello");
                  handleQuantityChange(_id, Math.min(stock, newQty + 1));
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            className="text-red-500 text-sm mt-2"
            onClick={() => handleRemoveFromCart(_id)}
          >
            Remove
          </button>
          {newQty !== quantity && (
            <button
              type="button"
              className="text-sm mt-2 ml-4 text-green-500 "
              onClick={() => handleUpdateCart({ id: _id, quantity: newQty })}
            >
              Update Cart
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24">
          <ContactInfo
            userData={userData}
            isActive={tabActive === "ContactInfo"}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            email={email}
            setEmail={setEmail}
            onOpenActive={() => {
              setTabActive("ContactInfo");
              handleScrollToEl("ContactInfo");
            }}
            onCloseActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
          />
        </div>

        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            isActive={tabActive === "ShippingAddress"}
            address={address}
            setAddress={setAddress}
            userData={userData}
            onOpenActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            onCloseActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            confirmOrder={() => {
              const allFieldsFilled =
                phoneNumber &&
                email &&
                Object.values(address).every((value) => value);
              if (allFieldsFilled) {
                setTabActive("");
                DeliveryOptions(address.zipCode);
                return true;
              } else {
                toast.error("Please fill all the fields");
                return false;
              }
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={tabActive === "PaymentMethod"}
            onOpenActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onCloseActive={() => {
              if (paymentMethod == "cod") {
                setIsConfirmationOpen(true);
                return;
              }
              makePayment({
                amount: parseInt(total),
                description: "Payment to Blaze Ayurveda",
              });
            }}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-8">
        {userData == null ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col">
            <div className="flex-1">{renderLeft()}</div>

            <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="mb-4">
                {cartData && cartData.map(renderProduct)}
              </div>

              {couponApplied ? (
                <div className="flex justify-between items-center mb-4 bg-green-100 p-2 rounded-md">
                  <span className="text-sm">Coupon: {coupon}</span>
                  <button onClick={handleRemoveCoupon} className="text-red-500">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Enter Coupon"
                    />
                    <button
                      onClick={FunToApplyCoupon}
                      className="bg-green-500 text-white px-4 py-2 rounded-r-md text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {options.fastest && options.leastCost && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Options
                  </label>
                  <div className="space-y-2">
                    <div
                      onClick={() => handleOptionSelect(options.leastCost)}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedOption === options.leastCost
                          ? "border-2 border-green-500"
                          : "border border-gray-300"
                      }`}
                    >
                      <h4 className="font-medium">Free Delivery</h4>
                      <p className="text-sm text-gray-500">
                        Estimated: {options.leastCost.etd}
                      </p>
                    </div>
                    <div
                      onClick={() => handleOptionSelect(options.fastest)}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedOption === options.fastest
                          ? "border-2 border-green-500"
                          : "border border-gray-300"
                      }`}
                    >
                      <h4 className="font-medium">Express Delivery</h4>
                      <p className="text-sm text-gray-500">
                        ₹
                        {Math.floor(
                          options.fastest.rate - options.leastCost.rate
                        )}{" "}
                        • Estimated: {options.fastest.etd}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingEstimate === 0 ? "Free" : `₹${shippingEstimate}`}
                  </span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between">
                    <span>COD Charges</span>
                    <span className="font-semibold">₹50</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span className="font-semibold">- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                className="w-full bg-green-500 text-white py-3 rounded-full font-medium text-sm mt-6"
                onClick={() => {
                  const allFieldsFilled =
                    phoneNumber &&
                    email &&
                    Object.values(address).every((value) => value);
                  if (allFieldsFilled) {
                    if (paymentMethod === "cod") {
                      setIsConfirmationOpen(true);
                    } else {
                      makePayment({
                        amount: parseInt(total.toString()),
                        description: "Payment to Blaze Ayurveda",
                      });
                    }
                  } else {
                    // Show error toast
                    console.error("Please fill all the fields");
                  }
                }}
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}
      </main>

      <ConfirmationPopup
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmYes}
        message="Are you sure you want to place this order?"
      />
    </div>
  );
};

export default CheckoutPage;

{
  /* <div className="w-full lg:w-[36%] ">
  <h3 className="text-lg font-semibold">Order summary</h3>
  <div className="mt-8 divide-y divide-slate-700 ">
    {cartData && cartData.map(renderProduct)}
  </div>

  <div className="mt-10 pt-6 text-sm text-slate-400 border-t border-slate-700 ">
    {couponApplied ? (
      <div>
        <div className="flex justify-between py-2.5">
          <span>Coupon Code : {coupon}</span>
          <span className="font-semibold text-slate-200">
            Applied {"  "}
            <span>
              <button
                onClick={() => {
                  handleRemoveCoupon();
                }}
              >
                x
              </button>
            </span>
          </span>
        </div>
      </div>
    ) : (
      <div>
        <Label className="text-sm">Discount code</Label>
        <div className="flex mt-1.5">
          <Input
            sizeClass="h-10 px-4 py-3"
            className="flex-1"
            value={coupon} */
}
//             onChange={(event) => {
//               setCoupon(event.target.value);
//             }}
//             placeholder="Enter Coupon"
//           />
//           <button
//             onClick={() => {
//               FunToApplyCoupon();
//             }}
//             className="text-neutral-200 border border-neutral-700  rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-700 hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors"
//           >
//             Apply
//           </button>
//         </div>
//       </div>
//     )}
//     {options.fastest != null && options.leastCost != null && (
//       <div className="mt-4">
//         <Label className="text-sm">Delivery Options</Label>
//         <div className="flex mt-1.5">
//           <div
//             onClick={() => handleOptionSelect("leastCost")}
//             style={{
//               cursor: "pointer",
//               border:
//                 selectedOption === "leastCost"
//                   ? "2px solid blue"
//                   : "1px solid grey",
//               padding: "10px",
//               margin: "5px",
//             }}
//           >
//             <h4>Free Delivery</h4>
//             {/* <p>Courier: {options.leastCost.courier_name}</p>
//                         <p>Cost: ₹{options.leastCost.rate}</p> */}
//             <p>Estimated : {options.leastCost.etd}</p>
//           </div>
//           <div
//             onClick={() => handleOptionSelect("fastest")}
//             style={{
//               cursor: "pointer",
//               border:
//                 selectedOption === "fastest"
//                   ? "2px solid blue"
//                   : "1px solid grey",
//               padding: "10px",
//               margin: "5px",
//             }}
//           >
//             <h4>
//               Express Delivery At ₹
//               {Math.floor(options.fastest.rate - options.leastCost.rate)}
//             </h4>
//             {/* <p>Courier: {options.fastest.courier_name}</p> */}
//             {/* <p>Cost: ₹{options.fastest.rate}</p> */}
//             <p>Estimated : {options.fastest.etd}</p>
//           </div>
//         </div>
//       </div>
//     )}

//     <div className="mt-4 flex justify-between py-2.5">
//       <span>Subtotal</span>
//       <span className="font-semibold text-slate-200">₹{subtotal}</span>
//     </div>
//     <div className="flex justify-between py-2.5">
//       <span>Shipping estimate</span>
//       <span className="font-semibold text-slate-200">
//         {shippingEstimate == 0 ? "Free" : `₹${shippingEstimate}`}
//       </span>
//     </div>
//     {paymentMethod == "cod" && (
//       <div className="flex justify-between py-2.5">
//         <span>COD Charges</span>
//         <span className="font-semibold text-slate-200">₹50</span>
//       </div>
//     )}
//     {discount > 0 && (
//       <div className="flex justify-between py-2.5">
//         <span>Discount</span>
//         <span className="font-semibold text-slate-200">- ₹{discount}</span>
//       </div>
//     )}
//     {/* <div className="flex justify-between py-2.5">
//                   <span>Tax estimate</span>
//                   <span className="font-semibold text-slate-200">
//                     {" "}
//                     ₹{taxEstimate}
//                   </span>
//                 </div> */}
//     <div className="flex justify-between font-semibold text-slate-200 text-base pt-4">
//       <span>Order total</span>
//       <span>₹{total}</span>
//     </div>
//   </div>
//   <ButtonPrimary
//     className="mt-8 w-full"
//     onClick={() => {
//       const allFieldsFilled =
//         phoneNumber && email && Object.values(address).every((value) => value);
//       if (allFieldsFilled) {
//         {
//           if (paymentMethod == "cod") {
//             handlePlaceOrderOnCOD();
//             return;
//           }
//           makePayment({
//             amount: parseInt(total),
//             description: "Payment to Blaze Ayurveda",
//           });
//         }
//       } else {
//         toast.error("Please fill all the fields");
//       }
//     }}
//   >
//     Confirm order
//   </ButtonPrimary>
// </div>;

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getEventData,
  updateDocument,
  updateEventArrays,
  wishlistEvent,
  registerEvent,
  getUserData,
} from "@/src/utils/get-url";

const EventPage = (props) => {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [wishListed, setWishListed] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const makePayment = async ({ amount, description }) => {
    const razorPayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
    const razorPayId = process.env.NEXT_PUBLIC_RAZORPAY_ID;

    var options = {
      key: razorPayId,
      key_secret: razorPayKey,
      name: "Verse Jack",
      currency: "INR",
      amount: amount * 100,
      description: description,
      image: "https://example.com/your_logo",
      handler: function (response) {
        registerFunction();
      },
      prefill: {
        name: localStorage.getItem("name"),
        email: "priyansh@gmail.com",
        contact: "8956214584",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      console.log(response, "Response error");
    });
    rzp1.open();
  };

  const registerFunction = async () => {
    try {
      const id = props.params.id;
      const user_id = localStorage.getItem("id");
      const data = await registerEvent(user_id, id);
      if (data) {
        setRegistered(true);
      } else {
        alert("User Already Registered");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRegister = async () => {
    if (event.fees == 0) {
      registerFunction();
    } else {
      makePayment({ amount: event.fees, description: event.eventName });
    }
  };

  const handleWishList = async () => {
    const id = props.params.id;
    const user_id = localStorage.getItem("id");
    const data = await wishlistEvent(user_id, id);
    setWishListed(data);
  };

  const fetchData = async () => {
    const id = props.params.id;
    const user_id = localStorage.getItem("id");
    const { registered, wishListed } = await updateEventArrays(user_id, id);
    setRegistered(registered);
    setWishListed(wishListed);

    const eventData = await getEventData(id);
    if (eventData) {
      console.log(eventData.eventDateTime, "===================Data");
      console.log(new Date(eventData.eventDateTime).toISOString());
      setDate(new Date(eventData.eventDateTime));
      setEvent(eventData);
      const creatorData = await getUserData(eventData.creatorId);
      if (creatorData) {
        setCreator(creatorData);
      }
    }

    let event_count = eventData.event_count;
    event_count++;
    await updateDocument("events", id, { event_count });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {event ? (
        <div className="container mx-auto px-4 py-8 max-w-screen-lg">
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            {/* Event Title and Details */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="lg:w-2/3">
                <h1 className="text-4xl font-bold mb-2">{event.eventName}</h1>
                <p className="text-gray-400">{date.toString()}</p>
                <p className="text-gray-400">Duration: {event.duration} hr</p>
              </div>
              <div className="lg:w-1/3 lg:text-right mt-4 lg:mt-0">
                <p className="text-lg font-semibold">
                  Price: {event.fees == 0 ? "Free" : `₹${event.fees}`}
                </p>
                {registered ? (
                  <p className="text-green-500 mt-2">
                    You are registered for this event.
                  </p>
                ) : (
                  <button
                    onClick={handleRegister}
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                  >
                    Register Now
                  </button>
                )}
                <button
                  onClick={handleWishList}
                  className={`mt-2 ${
                    wishListed
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-blue-500 hover:bg-blue-700"
                  } text-white py-2 px-4 rounded-lg ml-4`}
                >
                  {wishListed ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            {/* Event Image */}
            <div className="relative mb-8">
              <img
                src={event.eventImageUrl}
                alt={event.eventName}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>

            {/* About the Event */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About the Event</h2>
              <p className="text-lg">{event.description}</p>
            </div>
          </div>

          {/* Creator Information */}
          {creator && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Event Creator</h3>
              <div className="flex items-center space-x-4">
                <Image
                  src={creator.profilePicture || "/default-avatar.png"}
                  alt={creator.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <p className="text-lg font-semibold">{creator.name}</p>
                  <p className="text-gray-400">{creator.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default EventPage;

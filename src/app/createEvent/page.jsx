"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createEvent } from "@/src/utils/get-url";

const s3Client = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT,
  forcePathStyle: false,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const uploadObject = async (file) => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: `events/event-images/${
      process.env.NEXT_PUBLIC_WHITE_LABEL_FOR
    }/${Date.now()}_${file.name}`,
    Body: file,
    ACL: "public-read",
  };

  try {
    const toastId = toast.loading("Uploading Image");
    const data = await s3Client.send(new PutObjectCommand(params));
    toast.dismiss(toastId);
    toast.success("Image Uploaded");
    const uploadedObjectUrl = `https://${params.Bucket}.${process.env.NEXT_PUBLIC_AWS_REGION}.cdn.digitaloceanspaces.com/${params.Key}`;
    return { data, url: uploadedObjectUrl };
  } catch (err) {
    toast.error("Error Uploading object", err);
  }
};

const CreateEvent = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
      setName(localStorage.getItem("name"));
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImageUrl("");
  };

  const onSubmit = async (data) => {
    // Get current date and time
    const now = new Date();
    // Convert event date and time to Date object
    const eventDateTime = new Date(`${data.date}T${data.time}`);

    // Check if event date and time is in the past
    if (eventDateTime < now) {
      toast.error("Event date and time cannot be in the past.");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload an event image");
      return;
    }

    const uploadedImage = await uploadObject(imageFile);

    let eventCost = 0;
    if (data.eventType === "Small") {
      eventCost = 15000;
    } else if (data.eventType === "Mid") {
      eventCost = 75000;
    } else if (data.eventType === "Large") {
      eventCost = 225000;
    } else if (data.eventType === "Community") {
      eventCost = 450000;
    }

    let eventData = {
      eventName: data.eventName,
      organizedBy: data.orgName,
      eventDate: data.date,
      eventTime: data.time,
      duration: data.duration,
      description: data.description,
      type: data.eventType,
      fees: data.fees,
      creatorId: userId,
      eventImageUrl: uploadedImage.url,
    };

    try {
      await makePayment({
        amount: eventCost,
        description: data.eventName,
        collectionName: "events",
        eventData,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating event");
    }
  };

  const makePayment = async ({
    amount,
    description,
    collectionName,
    eventData,
  }) => {
    const razorPayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
    const razorPayId = process.env.NEXT_PUBLIC_RAZORPAY_ID;

    var options = {
      key: razorPayId,
      key_secret: razorPayKey,
      name: "Verse Jack",
      currency: "INR",
      amount: amount,
      description: description,
      image: "https://example.com/your_logo",
      handler: function (response) {
        console.log(response);
        createEventFun({ collectionName, eventData });
      },
      prefill: {
        name: localStorage.getItem("name"),
        email: "example@email.com",
        contact: "1234567890",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      console.log(response, "Response error");
      toast.error("Payment failed");
    });
    rzp1.open();
  };

  const createEventFun = async ({ collectionName, eventData }) => {
    try {
      await createEvent(collectionName, eventData);
      toast.success("Event created successfully!");
      router.push("/events");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating event");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="eventName">Event Name:</label>
          <input
            {...register("eventName", { required: "Event Name is required" })}
            placeholder="Event Name"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.eventName && (
            <p className="text-red-500">{errors.eventName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="orgName">Organization Name:</label>
          <input
            {...register("orgName", {
              required: "Organization Name is required",
            })}
            placeholder="Organization Name"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.orgName && (
            <p className="text-red-500">{errors.orgName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date">Date:</label>
          <input
            {...register("date", { required: "Date is required" })}
            type="date"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
        </div>

        <div>
          <label htmlFor="time">Time:</label>
          <input
            {...register("time", { required: "Time is required" })}
            type="time"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.time && <p className="text-red-500">{errors.time.message}</p>}
        </div>

        <div>
          <label htmlFor="duration">Duration (in hours):</label>
          <input
            {...register("duration", { required: "Duration is required" })}
            type="number"
            placeholder="Duration"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.duration && (
            <p className="text-red-500">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Event Description"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="eventImage">Event Image:</label>
          <input
            type="file"
            id="add-image"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="add-image"
            className="cursor-pointer w-full p-2 border border-gray-300 rounded bg-blue-500 text-white text-center"
          >
            Add Image
          </label>
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageUrl && (
              <div className="relative">
                <img src={imageUrl} alt="Event" className="w-full h-auto" />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded"
                >
                  X
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="eventType">Event Type:</label>
          <select
            {...register("eventType", { required: "Event Type is required" })}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          >
            <option value="">Select Event Type</option>
            <option value="Small">Small UpTo 20 [Costs 150₹]</option>
            <option value="Mid">Mid UpTo 100 [Costs 750₹]</option>
            <option value="Large">Large UpTo 300 [Costs 2250₹]</option>
            <option value="Community">Community UpTo 600 [Costs 4500₹]</option>
          </select>
          {errors.eventType && (
            <p className="text-red-500">{errors.eventType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fees">Event Fee in ₹ (If Free enter 0):</label>
          <input
            {...register("fees", { required: "Event Fee is required" })}
            type="number"
            placeholder="Event Fee"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.fees && <p className="text-red-500">{errors.fees.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;

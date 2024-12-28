"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  addCategory,
  addProduct,
  getCollectionData,
} from "@/src/utils/get-url";

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
    Key: `marketplace/product-images/${
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

const AddProduct = () => {
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
  const [categories, setCategories] = useState([]);
  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);
  const [imageFiles, setImageFiles] = useState([]);
  const [mrp, setMrp] = useState(0);
  const [discount, setDiscount] = useState(0);
  const sellingPrice = mrp - (mrp * discount) / 100;

  const fetchCategories = async () => {
    const data = await getCollectionData("category");
    setCategories(
      data.map((category) => ({ value: category._id, name: category.name }))
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
      setName(localStorage.getItem("name"));
    }
    fetchCategories();
  }, []);

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecifications);
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleImageRemove = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (imageFiles.length < 3) {
      toast.error("Please upload at least 3 images");
      return;
    }

    const imageUploadPromises = imageFiles.map((file) => uploadObject(file));
    const uploadedImages = await Promise.all(imageUploadPromises);
    const uploadedImageUrls = uploadedImages.map((img) => img.url);

    if (data.category === "other") {
      const response = await addCategory(data.newCategory);
      if (response.status === 409) {
        toast.error(response.error);
        return;
      }
      data.category = response;
    }

    const productData = {
      itemName: data.itemName,
      description: data.description,
      specifications,
      imageUrls: uploadedImageUrls,
      mrp: data.mrp,
      discount: data.discount,
      sellingPrice,
      replacementPolicy: data.replacementPolicy,
      warranty: data.warranty,
      stock: data.stock,
      category: data.category,
      height: data.height,
      length: data.length,
      breadth: data.breadth,
      weight: data.weight,
      sellerId: userId,
    };

    try {
      await addProduct("Products", productData);
      toast.success("Product added successfully!");
      router.push("/marketplace");
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="itemName">Product Name:</label>
          <input
            {...register("itemName", { required: "Product Name is required" })}
            placeholder="Product Name"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.itemName && (
            <p className="text-red-500">{errors.itemName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description">Product Description:</label>
          <textarea
            {...register("description", {
              required: "Product Description is required",
            })}
            placeholder="Product Description"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label>Product Specifications:</label>
          {specifications.map((spec, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={spec.key}
                onChange={(e) =>
                  handleSpecificationChange(index, "key", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-700 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) =>
                  handleSpecificationChange(index, "value", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-700 rounded bg-gray-800 text-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveSpecification(index)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSpecification}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Specification
          </button>
        </div>

        <div>
          {/* <label htmlFor="productImage">Product Images:</label>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            className="hidden"
          />
          <label
            htmlFor="add-image"
            className="cursor-pointer w-full p-2 border border-gray-300 rounded bg-blue-500 text-white text-center"
          >
            Add Image
          </label> */}
          <label htmlFor="productImage">Product Images:</label>
          <input
            type="file"
            id="add-image"
            onChange={handleImageChange}
            multiple
            className="hidden"
          />
          <label
            htmlFor="add-image"
            className="cursor-pointer w-full p-2 border border-gray-300 rounded bg-blue-500 text-white text-center"
          >
            Add Image
          </label>
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-auto"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="mrp">MRP in Rs:</label>
          <input
            {...register("mrp", {
              required: "MRP is required",
              valueAsNumber: true,
              onChange: (e) => setMrp(parseFloat(e.target.value) || 0),
            })}
            type="number"
            placeholder="MRP"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.mrp && <p className="text-red-500">{errors.mrp.message}</p>}
        </div>

        <div>
          <label htmlFor="discount">Discount in %:</label>
          <input
            {...register("discount", {
              required: "Discount is required",
              valueAsNumber: true,
              onChange: (e) => setDiscount(parseFloat(e.target.value) || 0),
            })}
            type="number"
            placeholder="Discount"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.discount && (
            <p className="text-red-500">{errors.discount.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="sellingPrice">Selling Price:</label>
          <input
            value={sellingPrice}
            disabled
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white bg-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="replacementPolicy">
            Replacement Policy (in Days):
          </label>
          <input
            {...register("replacementPolicy", {
              required: "Replacement Policy is required",
            })}
            type="number"
            placeholder="Replacement Policy"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.replacementPolicy && (
            <p className="text-red-500">{errors.replacementPolicy.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="warranty">Warranty (in Years):</label>
          <input
            {...register("warranty", { required: "Warranty is required" })}
            type="number"
            placeholder="Warranty"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.warranty && (
            <p className="text-red-500">{errors.warranty.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock">Stock (in number):</label>
          <input
            {...register("stock", { required: "Stock is required" })}
            type="number"
            placeholder="Stock"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.stock && (
            <p className="text-red-500">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="height">Height (in cm):</label>
          <input
            {...register("height", { required: "Height is required" })}
            type="number"
            placeholder="Height (in cm)"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.stock && (
            <p className="text-red-500">{errors.height.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="length">length (in cm):</label>
          <input
            {...register("length", { required: "Length is required" })}
            type="number"
            placeholder="Length (in cm)"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.stock && (
            <p className="text-red-500">{errors.length.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="breadth">Breadth (in cm):</label>
          <input
            {...register("breadth", { required: "Breadth is required" })}
            type="number"
            placeholder="Breadth (in cm)"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.stock && (
            <p className="text-red-500">{errors.breadth.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="weight">Weight (in gram):</label>
          <input
            {...register("weight", { required: "Weight is required" })}
            type="number"
            placeholder="Weight (in gram)"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
          {errors.stock && (
            <p className="text-red-500">{errors.weight.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          >
            <option value="select">Select Category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>

        {watch("category") === "other" && (
          <div>
            <label htmlFor="newCategory">New Category:</label>
            <input
              {...register("newCategory", {
                required: "New Category is required",
              })}
              placeholder="New Category"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            {errors.newCategory && (
              <p className="text-red-500">{errors.newCategory.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

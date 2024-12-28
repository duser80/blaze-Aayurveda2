"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Plus, Minus, X, Upload } from "lucide-react";
import Image from "next/image";
import {
  getProductData,
  updateDocument,
  getCollectionData,
  addCategory,
} from "@/src/utils/get-url";
import MarkdownEditor from "@/src/components/MarkdownEditor";

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

const EditProduct = ({ params }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();
  const productId = params.id;

  const [userId, setUserId] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [name, setName] = useState(null);
  const [categories, setCategories] = useState([]);
  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [mrp, setMrp] = useState(0);
  const [discount, setDiscount] = useState(0);
  const sellingPrice = mrp - (mrp * discount) / 100;

  const fetchCategories = async () => {
    const data = await getCollectionData("category");
    setCategories(
      data.map((category) => ({ value: category._id, name: category.name }))
    );
  };

  const fetchProduct = async (id) => {
    const product = await getProductData(id);
    if (product) {
      setValue("itemName", product.itemName);
      setValue("description", product.description);
      setProductDescription(product.description);
      setValue("mrp", product.mrp);
      setValue("discount", product.discount);
      setValue("replacementPolicy", product.replacementPolicy);
      setValue("warranty", product.warranty);
      setValue("stock", product.stock);
      setValue("category", product.category);
      setValue("height", product.physics.height);
      setValue("length", product.physics.length);
      setValue("breadth", product.physics.breadth);
      setValue("weight", product.physics.weight);
      setSpecifications(product.specifications || []);
      setImageUrls(product.productImage || []);
      setMrp(product.mrp);
      setDiscount(product.discount);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
      setName(localStorage.getItem("name"));
    }
    fetchCategories();
    fetchProduct(productId);
  }, [productId]);

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleDescriptionChange = (markdown) => {
    setValue("description", markdown);
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

  const handleInitialImageRemove = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
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
      productImage: [...imageUrls, ...uploadedImageUrls],
      mrp: data.mrp,
      discount: data.discount,
      price: sellingPrice,
      replacementPolicy: data.replacementPolicy,
      warranty: data.warranty,
      stock: parseInt(data.stock),
      category: data.category,
      physics: {
        height: data.height,
        length: data.length,
        breadth: data.breadth,
        weight: data.weight,
      },
    };

    try {
      const result = await updateDocument("Products", productId, productData);
      toast.success("Product updated successfully!");
      router.push("/seller");
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="itemName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name
          </label>
          <input
            {...register("itemName", { required: "Product Name is required" })}
            placeholder="Product Name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.itemName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.itemName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Description
          </label>
          <MarkdownEditor
            onChange={handleDescriptionChange}
            initialValue={productDescription}
          />
          {/* <textarea
            {...register("description", {
              required: "Product Description is required",
            })}
            placeholder="Product Description"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={4}
          /> */}
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Specifications
          </label>
          {specifications.map((spec, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={spec.key}
                onChange={(e) =>
                  handleSpecificationChange(index, "key", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) =>
                  handleSpecificationChange(index, "value", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => handleRemoveSpecification(index)}
                className="bg-red-500 text-white p-2 rounded-full"
              >
                <Minus size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSpecification}
            className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center justify-center w-full"
          >
            <Plus size={16} className="mr-2" /> Add Specification
          </button>
        </div>

        <div>
          <label
            htmlFor="productImage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Images
          </label>
          <input
            type="file"
            id="add-image"
            onChange={handleImageChange}
            multiple
            className="hidden"
          />
          <label
            htmlFor="add-image"
            className="cursor-pointer w-full p-2 border border-gray-300 rounded-md bg-white text-green-500 text-center flex items-center justify-center"
          >
            <Upload size={20} className="mr-2" /> Add Image
          </label>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <Image
                  src={url}
                  alt={`Product Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleInitialImageRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="mrp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              MRP in Rs
            </label>
            <input
              {...register("mrp", {
                required: "MRP is required",
                valueAsNumber: true,
                onChange: (e) => setMrp(parseFloat(e.target.value) || 0),
              })}
              type="number"
              placeholder="MRP"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.mrp && (
              <p className="text-red-500 text-sm mt-1">{errors.mrp.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discount in %
            </label>
            <input
              {...register("discount", {
                required: "Discount is required",
                valueAsNumber: true,
                onChange: (e) => setDiscount(parseFloat(e.target.value) || 0),
              })}
              type="number"
              placeholder="Discount"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.discount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="sellingPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selling Price
          </label>
          <input
            value={sellingPrice.toFixed(2)}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="replacementPolicy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Replacement Policy (Days)
            </label>
            <input
              {...register("replacementPolicy", {
                required: "Replacement Policy is required",
              })}
              type="number"
              placeholder="Replacement Policy"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.replacementPolicy && (
              <p className="text-red-500 text-sm mt-1">
                {errors.replacementPolicy.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="warranty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Warranty (Years)
            </label>
            <input
              {...register("warranty", { required: "Warranty is required" })}
              type="number"
              placeholder="Warranty"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.warranty && (
              <p className="text-red-500 text-sm mt-1">
                {errors.warranty.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stock
          </label>
          <input
            {...register("stock", { required: "Stock is required" })}
            type="number"
            placeholder="Stock"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Height (cm)
            </label>
            <input
              {...register("height", { required: "Height is required" })}
              type="number"
              placeholder="Height (cm)"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.height && (
              <p className="text-red-500 text-sm mt-1">
                {errors.height.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="length"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Length (cm)
            </label>
            <input
              {...register("length", { required: "Length is required" })}
              type="number"
              placeholder="Length (cm)"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.length && (
              <p className="text-red-500 text-sm mt-1">
                {errors.length.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="breadth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Breadth (cm)
            </label>
            <input
              {...register("breadth", { required: "Breadth is required" })}
              type="number"
              placeholder="Breadth (cm)"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.breadth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.breadth.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight (gram)
            </label>
            <input
              {...register("weight", { required: "Weight is required" })}
              type="number"
              placeholder="Weight (gram)"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">
                {errors.weight.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {watch("category") === "other" && (
          <div>
            <label
              htmlFor="newCategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Category
            </label>
            <input
              {...register("newCategory", {
                required: "New Category is required",
              })}
              placeholder="New Category"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.newCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newCategory.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

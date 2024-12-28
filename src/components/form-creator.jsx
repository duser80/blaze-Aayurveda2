"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { toast } from "react-toastify";

const s3Client = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT,
  forcePathStyle: false,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID, // Access key pair. You can create access key pairs using the control panel or API.
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY, // Secret access key defined through an environment variable.
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
    //we're returning cdn link directly to be entered in database
    const uploadedObjectUrl = `https://${params.Bucket}.${process.env.NEXT_PUBLIC_AWS_REGION}.cdn.digitaloceanspaces.com/${params.Key}`;
    return { data, url: uploadedObjectUrl };
  } catch (err) {
    toast.error("Error Uploading object", err);
  }
};

function FormCreator({
  fields,
  register,
  control,
  errors,
  buttonText,
  onSubmit,
  handleSubmit,
}) {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  async function onSelectFile(e) {
    const inputFiles = e.target.files;
    for (let i = 0; i < inputFiles.length; i++) {
      const file = inputFiles[i];
      // console.log(inputFiles, "input files");
      try {
        const imageUrl = await uploadObject(file);
        setFiles((files) => [
          ...files,
          {
            file: file,
            previewURL: URL.createObjectURL(file),
          },
        ]);
        setImageUrls((urls) => [...urls, imageUrl.url]);
      } catch (error) {
        console.error("Error uploading image to S3:", error);
      }
    }
  }

  const onSubmitWithImages = (data) => {
    //upload all files here on s3 before submitting the form
    data.imageUrls = imageUrls;
    onSubmit(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmitWithImages)}
        className="space-y-6 p-4 bg-gray-50 rounded-lg"
      >
        {fields.map((formInputData, index) => (
          <AnimatePresence key={`form-${index}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <label
                htmlFor={formInputData.name}
                className="block text-sm font-medium text-gray-700"
              >
                {formInputData.label}:
              </label>
              {formInputData.field === "field" && (
                <div className="flex flex-col space-y-1">
                  <input
                    {...register(formInputData.name)}
                    placeholder={formInputData.label}
                    type={formInputData.inputType ?? "text"}
                    required={formInputData.required}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formInputData.children && formInputData.children}
                  {formInputData.suggestionText && (
                    <p className="text-xs text-gray-500">
                      {formInputData.suggestionText}
                    </p>
                  )}
                </div>
              )}
              {formInputData.field === "select" && (
                <select
                  {...register(formInputData.name)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {formInputData.options?.map((option, optionIndex) => {
                    const optionValue =
                      typeof option === "object" ? option.value : option;
                    const optionName =
                      typeof option === "object" ? option.name : option;
                    return (
                      <option key={optionIndex} value={optionValue}>
                        {optionName}
                      </option>
                    );
                  })}
                </select>
              )}
              {formInputData.field === "image" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor={`file-upload-${index}`}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      <input
                        id={`file-upload-${index}`}
                        type="file"
                        onChange={onSelectFile}
                        multiple={formInputData.multiple}
                        className="hidden"
                        onClick={(e) => (e.target.value = null)}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {files.map((data, fileIndex) => (
                      <div
                        key={`${data.name}-${fileIndex}`}
                        className="relative"
                      >
                        <img
                          src={data.previewURL}
                          alt={`Preview ${fileIndex}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(fileIndex)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {formInputData.field === "slider" && (
                <div className="space-y-2">
                  <input
                    type="range"
                    {...register(formInputData.name)}
                    min={formInputData.min}
                    max={formInputData.max}
                    className="w-full"
                    onInput={(e) => {
                      e.target.nextElementSibling.textContent = `${formInputData.name}: ${e.target.value} ${formInputData.unit}`;
                    }}
                  />
                  <output className="block text-sm text-gray-600">
                    {formInputData.name}: {formInputData.min}{" "}
                    {formInputData.unit}
                  </output>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ))}
        <button
          type="submit"
          className="w-full bg-green-500 text-white font-medium py-2 px-4 rounded-full hover:bg-green-600 transition duration-300 ease-in-out"
        >
          {buttonText}
        </button>
      </form>
    </>
  );
}
export default FormCreator;

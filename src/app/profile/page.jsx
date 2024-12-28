"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getUserData, updateDocument } from "@/src/utils/get-url";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userName: "Username",
    name: "Name",
    gender: "Gender",
    pronouns: "Pronouns",
    description: "Description",
    mobile: "",
    links: "Links",
  });

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id"); // Get user ID from local storage
      const user = await getUserData(id); // replace 'users' with your collection name
      if (user) {
        // const user = data[4]; // assuming the first document is the user's data
        // const user = data.find(doc => doc.id === id); // Find the user's data by ID

        console.log(user, "user");
        setUserDetails({
          userName: user?.userName,
          name: user?.name,
          gender: user?.gender,
          pronouns: user?.pronouns,
          description: user?.description,
          mobile: user?.mobile,
          links: user?.links,
        });
      }
    };

    fetchData();
  }, []);

  const genders = ["Male", "Female", "Other"];
  const pronouns = ["He/Him", "She/Her", "They/Them"];

  const handleEdit = async () => {
    if (isEditing) {
      // Save the changes
      const id = localStorage.getItem("id"); // Get user ID from local storage
      const result = await updateDocument("user", id, userDetails);
      console.log(`Updated ${result} document(s)`);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex ml-8 mr-8 justify-center">
      <div className="flex flex-col w-1/2 p-0">
        <div className="self-end">
          <button
            className=" bg-blue-500 hover:bg-blue-700 mt-10 text-white font-bold py-4 px-4 rounded text-xs"
            onClick={handleEdit}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
        <div className="flex items-center justify-center mb-10">
          <Image
            src={
              "https://imgs.search.brave.com/6AwCUksXbtKNR3NLWOjPziV1Wnlj8tUVO4z3-_rZqRg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zMy5h/bWF6b25hd3MuY29t/L21lZGlhLm1peHJh/bmsuY29tL3Byb2Zp/bGVwaWMvNDZmMzYx/OWVmNzU2NGFlZGNm/NjI5MzUxYmU5ZGVh/NTY.jpeg"
            }
            alt="Profile Photo"
            width={200}
            height={200}
            className="rounded-full ml-24 mb-5"
          />
        </div>
        {Object.keys(userDetails).map((key) => {
          if (key === "gender" || key === "pronouns") {
            return (
              <label key={key} className="block mt-6">
                <span className="text-gray-300 capitalize">{key}</span>
                <select
                  name={key}
                  value={userDetails[key]}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block p-2 border rounded text-lg w-full ${
                    isEditing
                      ? "bg-white text-black"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {(key === "gender" ? genders : pronouns).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            );
          } else {
            return (
              <label key={key} className="block mt-6">
                <span className="text-gray-300 capitalize">{key}</span>
                <input
                  type="text"
                  name={key}
                  value={userDetails[key]}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block p-2 border rounded text-lg w-full ${
                    isEditing
                      ? "bg-white text-black"
                      : "bg-gray-200 text-gray-700"
                  }`}
                />
              </label>
            );
          }
        })}
      </div>
      <div className="flex flex-col w-1/2 p-12 items-center">
        <h2 className="text-4xl mb-8">Select your avatar</h2>
        <div className="flex justify-center items-center mb-8">
          <div className="w-50 h-50 border rounded-full mr-8">
            <img
              className="w-50 h-50 object-cover rounded-full"
              src="https://imgs.search.brave.com/6AwCUksXbtKNR3NLWOjPziV1Wnlj8tUVO4z3-_rZqRg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zMy5h/bWF6b25hd3MuY29t/L21lZGlhLm1peHJh/bmsuY29tL3Byb2Zp/bGVwaWMvNDZmMzYx/OWVmNzU2NGFlZGNm/NjI5MzUxYmU5ZGVh/NTY.jpeg"
              alt="Your 3D Avatar"
            />
          </div>
          <div className="flex flex-col justify-center ml-8">
            <div className="w-24 h-24 border rounded mb-8">Avatar Option 1</div>
            <div className="w-24 h-24 border rounded mb-8">Avatar Option 2</div>
            <div className="w-24 h-24 border rounded mb-8">Avatar Option 3</div>
            {/* Add more avatar options as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}

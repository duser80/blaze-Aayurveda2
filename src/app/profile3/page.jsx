'use client'
import { useState } from "react";
// import ButtonSecondary from "@/src/shared/Button/ButtonSecondary";
export default function ProfilePage() {
  const [tab, setTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);

  
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "My Orders" },
    { id: "wishlist", label: "Wishlist" },
    { id: "addresses", label: "Addresses" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      

      {/* Navigation Tabs */}
      <div className="bg-white flex justify-evenly shadow mt-4">
        <div className="flex space-x-4 p-4 border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 ${
                tab === t.id
                  ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
        <div className=" p-4 flex items-center space-x-4">
        <button
          className="ml-auto px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Edit Profile
        </button>
        
        <img
          src="/prof.jpg"
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          {/* <h1 className="text-2xl font-bold">client</h1> */}
          {/* <p className="text-gray-600">client@example.com</p> */}
        </div>
      </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {tab === "overview" && <Overview />}
        {tab === "orders" && <TrackOrder />}
        {tab === "wishlist" && <Wishlist />}
        {tab === "addresses" && <Addresses />}
        {tab === "settings" && <Settings />}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <EditProfileModal
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedData) => {
            console.log("Updated Profile Data: ", updatedData);
            setIsModalOpen(false);
          }}
        />
      )} 

{isModalAddressOpen && (
        <AddNewAddressModal
          onCloseAd={() => setIsModalAddressOpen(false)}
          onSaveAd={(updatedData) => {
            console.log("Updated Profile Data: ", updatedData);
            setIsModalAddressOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Dummy Components for Tabs
const Overview = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Welcome Back, John!</h2>
    <div className="grid grid-cols-3 gap-4">
      <Card title="Total Orders" value="25" />
      <Card title="Wishlist Items" value="8" />
      <Card title="Reward Points" value="1200" />
    </div>
  </div>
);

const Card = ({ title, value }) => (
  <div className="p-4 bg-white shadow rounded text-center">
    <h3 className="text-gray-600">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// const Orders = () => <div>Order history here...</div>;
const TrackOrder=() =>{
  return (
    <div className="lg:col-span-9 md:col-span-12">
      {/* Card Container */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">Track your Order</h1>

          {/* Description */}
          <p className="text-gray-700 mb-8">
            To track your order, please enter your Order ID in the box below and
            press the "Track" button. This was given to you on your receipt and
            in the confirmation email you should have received.
          </p>

          {/* Form */}
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order ID */}
              <div>
                <label
                  htmlFor="order-id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order ID *
                </label>
                <input
                  type="text"
                  id="order-id"
                  placeholder="Found in your confirmation email"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="track-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="track-email"
                  placeholder="Email you used during checkout"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              TRACK
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const Wishlist = () => <div>Wishlist items here...</div>;
const Addresses = () => 
<div>
  <form className="space-y-6">
  {/* Container */}
  <div className="bg-white shadow rounded-lg mb-6">
    {/* Header */}
    <div className="flex mx-6 justify-between">
    <h2 className="text-lg font-semibold px-6 py-4 border-b">Make Default Shipping Address</h2>
      {/* <button className="p-1 my-3 text-xl bg-blue-600 h-[34] rounded-md text-white">Add New Address</button> */}
      {/* <button
          className="ml-auto px-2 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIsModalAddressOpen(true)}
          // onClick={() => setIsModalOpen(true)}
        >
          Add new address
        </button> */}
    </div>

    {/* Table Wrapper */}
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b px-6 py-3 font-medium text-gray-700">Action</th>
            <th className="border-b px-6 py-3 font-medium text-gray-700">Full Name</th>
            <th className="border-b px-6 py-3 font-medium text-gray-700">Address</th>
            <th className="border-b px-6 py-3 font-medium text-gray-700">Region</th>
            <th className="border-b px-6 py-3 font-medium text-gray-700">Phone Number</th>
            <th className="border-b px-6 py-3 font-medium text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Row 1 */}
          <tr className="odd:bg-gray-50">
            <td className="px-6 py-4">
              {/* Radio Box */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="address-1"
                  name="default-address"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  defaultChecked
                />
                <label htmlFor="address-1" className="sr-only">
                  Address 1
                </label>
              </div>
            </td>
            <td className="px-6 py-4">John Doe</td>
            <td className="px-6 py-4">4247 Ashford Drive Virginia VA-20006 USA</td>
            <td className="px-6 py-4">Virginia VA-20006 USA</td>
            <td className="px-6 py-4">(+0) 900901904</td>
            <td className="px-6 py-4">
              <p className="text-sm text-gray-700">Default Shipping Address</p>
              <p className="text-sm text-gray-700">Default Billing Address</p>
            </td>
          </tr>
          {/* Row 2 */}
          <tr className="odd:bg-gray-50">
            <td className="px-6 py-4">
              {/* Radio Box */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="address-2"
                  name="default-address"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="address-2" className="sr-only">
                  Address 2
                </label>
              </div>
            </td>
            <td className="px-6 py-4">Doe John</td>
            <td className="px-6 py-4">1484 Abner Road</td>
            <td className="px-6 py-4">Eau Claire WI - Wisconsin</td>
            <td className="px-6 py-4">(+0) 7154419563</td>
            <td className="px-6 py-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  {/* Save Button */}
  <div>
    <button
      type="submit"
      className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
    >
      SAVE
    </button>
  </div>
</form>

</div>;
const Settings = () => <div>
  <div className="lg:col-span-9 md:col-span-12">
      {/* Card Container */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">Add New Address</h1>

          {/* Description */}
          <p className="text-gray-700 mb-8">
            We need an address where we could deliver products.
          </p>

          {/* Form */}
          <form className="space-y-6">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address-fname"
                  className="block text-sm font-medium text-gray-700"
                >
                  FIRST NAME *
                </label>
                <input
                  type="text"
                  id="address-fname"
                  placeholder="First Name"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="address-lname"
                  className="block text-sm font-medium text-gray-700"
                >
                  LAST NAME *
                </label>
                <input
                  type="text"
                  id="address-lname"
                  placeholder="Last Name"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Phone and Street Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address-phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  PHONE *
                </label>
                <input
                  type="text"
                  id="address-phone"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="address-street"
                  className="block text-sm font-medium text-gray-700"
                >
                  STREET ADDRESS *
                </label>
                <input
                  type="text"
                  id="address-street"
                  placeholder="House Name and Street"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Country and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address-country"
                  className="block text-sm font-medium text-gray-700"
                >
                  COUNTRY *
                </label>
                <select
                  id="address-country"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" selected>
                    Choose Country
                  </option>
                  <option value="uae">United Arab Emirate (UAE)</option>
                  <option value="uk">United Kingdom (UK)</option>
                  <option value="us">United States (US)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="address-state"
                  className="block text-sm font-medium text-gray-700"
                >
                  STATE/PROVINCE *
                </label>
                <select
                  id="address-state"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" selected>
                    Choose State/Province
                  </option>
                  <option value="al">Alabama</option>
                  <option value="ak">Alaska</option>
                  <option value="ny">New York</option>
                </select>
              </div>
            </div>

            {/* Town/City and ZIP/Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address-city"
                  className="block text-sm font-medium text-gray-700"
                >
                  TOWN/CITY *
                </label>
                <input
                  type="text"
                  id="address-city"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="address-postal"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP/POSTAL CODE *
                </label>
                <input
                  type="text"
                  id="address-postal"
                  placeholder="Zip/Postal Code"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            {/* <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              SAVE
            </button> */}
            <div className="flex justify-end space-x-2">
          <button
            // onClick={onCloseAd}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            // onClick={() => onSaveAd(formData)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
</div>;

// Edit Profile Modal Component
function EditProfileModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    profilePicture: "/profile-pic.jpg",
    name: "John Doe",
    email: "johndoe@example.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        {/* Profile Picture */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <img
              src={formData.profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <input
              type="file"
              accept="image/*"
              className="text-gray-600"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profilePicture: URL.createObjectURL(e.target.files[0]),
                })
              }
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


 function AddNewAddressModal({ onCloseAd, onSaveAd }) {
  const [formData, setFormData] = useState({
    profilePicture: "/profile-pic.jpg",
    name: "John Doe",
    email: "johndoe@example.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className="lg:col-span-9 md:col-span-12">
      {/* Card Container */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">Add New Address</h1>

          {/* Description */}
          <p className="text-gray-700 mb-8">
            We need an address where we could deliver products.
          </p>

          {/* Form */}
          <form className="space-y-6">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address-fname"
                  className="block text-sm font-medium text-gray-700"
                >
                  FIRST NAME *
                </label>
                <input
                  type="text"
                  id="address-fname"
                  placeholder="First Name"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="address-lname"
                  className="block text-sm font-medium text-gray-700"
                >
                  LAST NAME *
                </label>
                <input
                  type="text"
                  id="address-lname"
                  placeholder="Last Name"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Phone and Street Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address-phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  PHONE *
                </label>
                <input
                  type="text"
                  id="address-phone"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="address-street"
                  className="block text-sm font-medium text-gray-700"
                >
                  STREET ADDRESS *
                </label>
                <input
                  type="text"
                  id="address-street"
                  placeholder="House Name and Street"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Country and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address-country"
                  className="block text-sm font-medium text-gray-700"
                >
                  COUNTRY *
                </label>
                <select
                  id="address-country"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" selected>
                    Choose Country
                  </option>
                  <option value="uae">United Arab Emirate (UAE)</option>
                  <option value="uk">United Kingdom (UK)</option>
                  <option value="us">United States (US)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="address-state"
                  className="block text-sm font-medium text-gray-700"
                >
                  STATE/PROVINCE *
                </label>
                <select
                  id="address-state"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" selected>
                    Choose State/Province
                  </option>
                  <option value="al">Alabama</option>
                  <option value="ak">Alaska</option>
                  <option value="ny">New York</option>
                </select>
              </div>
            </div>

            {/* Town/City and ZIP/Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address-city"
                  className="block text-sm font-medium text-gray-700"
                >
                  TOWN/CITY *
                </label>
                <input
                  type="text"
                  id="address-city"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="address-postal"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP/POSTAL CODE *
                </label>
                <input
                  type="text"
                  id="address-postal"
                  placeholder="Zip/Postal Code"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            {/* <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              SAVE
            </button> */}
            <div className="flex justify-end space-x-2">
          <button
            onClick={onCloseAd}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSaveAd(formData)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { SlBookOpen } from "react-icons/sl";

export const Sidebar = ({ user = "Administrator" }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <aside className="w-64 max-h-screen bg-white/80 backdrop-blur-md shadow-lg  flex flex-col justify-between sticky top-0">
      <div>
        {/* Logo */}
        {/* <div className="flex items-center gap-2 px-6 py-4 border-b">
          <SlBookOpen className="w-7 h-7 text-blue-600" />
          <span className="text-lg font-bold text-gray-800 tracking-wide">
            FlipBook
          </span>
        </div> */}

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-6 px-4">
          <img
            src={
              selectedImage ||
              "https://via.placeholder.com/100x100.png?text=Profile"
            }
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-blue-400 shadow-md object-cover"
          />
          <h2 className="mt-3 text-gray-800 font-semibold text-lg">
            Hi, {user}
          </h2>

          {/* Upload Button */}
          <label className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg cursor-pointer shadow-md transition">
            Upload Template
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <div className=" mt-4 w-full flex justify-center px-4">
            <input type="text" placeholder="Search..." className="border w-full py-1 px-2 rounded-xl"/>
        </div>

        {/* Navigation */}
        <nav className="mt-10 flex flex-col gap-3 px-6 text-gray-700 font-medium">
          <a
            href="/"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <AiOutlineHome className="w-5 h-5 text-blue-600" />
            Home
          </a>
          <a
            href="/create"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <FiPlusSquare className="w-5 h-5 text-blue-600" />
            Create
          </a>
          <a
            href="/create"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <FiPlusSquare className="w-5 h-5 text-blue-600" />
             Fipbook
          </a>
          <a
            href="/create"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <FiPlusSquare className="w-5 h-5 text-blue-600" />
            Account Setting
          </a>
          <a
            href="/templets"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <FiPlusSquare className="w-5 h-5 text-blue-600" />
            Templates
          </a>
        </nav>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} FlipBook
      </div>
    </aside>
  );
};

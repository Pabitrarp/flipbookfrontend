import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { SlBookOpen } from "react-icons/sl";
import { AiOutlineHome } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";

export const Header = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: <AiOutlineHome className="w-5 h-5" /> },
    { path: "/create", label: "Create", icon: <FiPlusSquare className="w-5 h-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md  shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <SlBookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800 tracking-wide">
            FlipBook
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 text-gray-600 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex items-center gap-2 transition-all duration-300 hover:text-blue-600 ${
                location.pathname === link.path ? "text-blue-600" : ""
              }`}
            >
              {link.icon}
              {link.label}
              {/* Active underline effect */}
              {location.pathname === link.path && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-600 rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Profile Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition cursor-pointer shadow-sm">
          <CgProfile className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </header>
  );
};

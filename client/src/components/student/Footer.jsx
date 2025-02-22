import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-500 md:px-36 text-left">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 border-white/30 border-b py-10">
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="" />
          <p className="text-white/80 mt-6 text-center md:text-left text-sm ">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure id
            assumenda facilis est quam sit sequi consectetur similique
            exercitationem soluta.
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="">About Us</a>
            </li>
            <li>
              <a href="">Contact Us</a>
            </li>
            <li>
              <a href="">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">
            Subscribe to our newsletter
          </h2>
          <p className="text-sm text-white/80">
            The Latest news,articles, and resources , sent to your inbox weekly.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <input
              className="text-white/80 px-2 py-1 text-sm border-gray-500/30 border bg-gray-800 w-64 h-9 rounded outline-none placeholder-gray-500"
              type="text "
              placeholder="Enter your email"
            />
            <button className="bg-blue-600 rounded w-24 h-9 text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="text-white/60 text-xs md:text-sm text-center py-4">
        Copyright 2025 © Anuradha. All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;

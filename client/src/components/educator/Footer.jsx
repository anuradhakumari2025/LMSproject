import React from "react";
import { assets } from "../../assets/assets";

// Footer component
const Footer = () => {
  return (
    // Footer wrapper with responsive flex layout, border, and background color
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t border-white bg-slate-700">
      
      {/* Left side: logo and copyright text */}
      <div className="flex items-center gap-4">
        {/* Logo image (only visible on medium screens and up) */}
        <img src={assets.logo_dark} alt="" className="hidden md:block w-20" />
        
        {/* Vertical separator line (only on medium screens and up) */}
        <div className="hidden md:block h-7 w-px bg-gray-200"></div>
        
        {/* Copyright text */}
        <p className="text-white/60 text-xs md:text-sm text-center py-4">
          Copyright 2025 © Anuradha. All Rights Reserved
        </p>
      </div>

      {/* Right side: social media icons */}
      <div className="py-4 text-center text-xs md:text-sm text-gray-50 flex gap-4 w-40">
        <a href="">
          {/* Facebook icon */}
          <img
            src={assets.facebook_icon}
            alt=""
            className="bg-white rounded-full"
          />
        </a>
        <a href="">
          {/* Twitter icon */}
          <img
            src={assets.twitter_icon}
            alt=""
            className="bg-white rounded-full"
          />
        </a>
        <a href="">
          {/* Instagram icon */}
          <img
            src={assets.instagram_icon}
            alt=""
            className="bg-white rounded-full"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

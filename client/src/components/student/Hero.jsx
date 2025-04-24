import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    // Hero section container with responsive padding and centered content
    <div className="flex flex-col items-center justify-center w-full md:pt-20 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-200/70">
      
      {/* Main heading */}
      <h1 className="md:text-[46px] text-[28px] relative font-bold text-gray-800 max-w-3xl mx-auto -tracking-normal leading-[28px] md:leading-[48px]">
        Empower your future with the courses designed
        {/* Highlighted text */}
        <span className="text-blue-800"> to fit your choice.</span>
        {/* Decorative sketch image shown only on medium and larger screens */}
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      {/* Description paragraph for medium and larger screens */}
      <p className="md:block hidden text-gray-400 max-w-2xl mx-auto md:leading-[22px] md:text-[16px]">
        Discover a world of opportunities with courses tailored to your goals.
        <br />
        Learn new skills, advance your career, and achieve your dreams today!
      </p>

      {/* Description paragraph for smaller screens */}
      <p className="md:hidden text-gray-300 max-w-sm mx-auto md:leading-[22px] md:text-[16px] leading-[20px] text-[14px]">
        Discover a world of opportunities with courses tailored to your goals.
        <br />
        Learn new skills, advance your career, and achieve your dreams today!
      </p>

      {/* Search bar component for finding courses */}
      <SearchBar />
    </div>
  );
};

export default Hero;

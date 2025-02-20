import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-20 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-200/70">
      <h1 className="md:text-[46px] text-[28px] relative font-bold text-gray-800 max-w-3xl mx-auto -tracking-normal leading-[28px] md:leading-[48px]">
        Empower your future with the courses designed
        <span className="text-blue-800"> to fit your choice.</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>
      <p className="md:block hidden text-gray-400 max-w-2xl mx-auto md:leading-[22px] md:text-[16px]">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam eos sequi
        voluptatum illum sapiente dolorum?
      </p>
      <p className="md:hidden text-gray-300 max-w-sm mx-auto md:leading-[22px] md:text-[16px] leading-[20px] text-[14px]">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi harum
        ratione eaque aspernatur obcaecati alias.
      </p>
      <SearchBar/>
    </div>
  );
};

export default Hero;

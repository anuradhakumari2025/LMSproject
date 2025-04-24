import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    // Container for the Call to Action section with padding and center alignment
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
      
      {/* Main headline */}
      <h1 className="md:text-4xl text-xl text-white font-medium">
        Learn anything,anytime,anywhere
      </h1>

      {/* Subtext/description */}
      <p className="md:text-base text-sm leading-5 text-gray-300">
        Unlock your potential with flexible learning options. <br />
        Start your journey today and achieve your dreams with ease!
      </p>

      {/* Buttons section */}
      <div className="text-gray-50 flex items-center gap-6 mt-4">
        
        {/* Primary button */}
        <button className="bg-blue-600 px-6 py-2 rounded-md cursor-pointer">
          Get Started
        </button>

        {/* Secondary button with an arrow icon */}
        <button className="flex items-center bg-blue-00 px-6 py-2 rounded-md gap-3 cursor-pointer">
          Learn More
          <img
            src={assets.arrow_icon} // Arrow icon image
            alt="arrowIcon"
            className="h-6 w-6 rounded-full bg-white px-1 py-1" // Styled to appear as a circle with padding
          />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;

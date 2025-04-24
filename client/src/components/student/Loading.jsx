import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParams(); // Extract the 'path' parameter from the URL
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    if (path) {
      // Navigate to the specified path after a 2-second delay
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 2000);

      // Cleanup the timeout on component unmount
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    // Full-screen loading spinner with blur background
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur">
      {/* Spinning loader */}
      <div className="w-10 sm:w-14 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

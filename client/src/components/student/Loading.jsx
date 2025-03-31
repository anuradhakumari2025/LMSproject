import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur">
      <div className="w-10 sm:w-14 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

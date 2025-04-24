import React from "react";
import { Outlet } from "react-router-dom"; // Importing Outlet to render child routes
import Navbar from "../../components/educator/Navbar"; // Import Navbar component for the educator layout
import Sidebar from "../../components/educator/Sidebar"; // Import Sidebar component for navigation
import Footer from "../../components/educator/Footer"; // Import Footer component for the layout

const Educator = () => {
  return (
    <div className="text-base min-h-screen"> {/* The outer container for the educator page */}
      <Navbar /> {/* Render the Navbar component at the top */}
      <div className="flex"> {/* Create a flex container for the Sidebar and main content */}
        <Sidebar /> {/* Render the Sidebar component on the left side */}
        <div className="flex-1">{<Outlet />}</div> {/* Render the child route components in the main content area */}
      </div>
      <Footer /> {/* Render the Footer component at the bottom */}
    </div>
  );
};

export default Educator; // Exporting the Educator component for use in routing

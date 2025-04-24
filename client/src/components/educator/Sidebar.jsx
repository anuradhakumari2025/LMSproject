import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // Access isEducator flag from context to conditionally render sidebar
  const { isEducator } = useContext(AppContext);

  // Array of sidebar menu items with name, route path, and icon
  const menuItems = [
    { name: "Dashboard", path: "/educator/dashboard", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  return (
    // Render sidebar only if the user is an educator
    isEducator && (
      <div className="flex bg-slate-500 flex-col md:w-64 w-16 border-r min-h-screen text-base border-gray-100 py-4">
        {/* Loop through menu items and render navigation links */}
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/educator"} // Make sure only exact path is matched
            className={({ isActive }) =>
              `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-4 ${
                isActive
                  ? `bg-indigo-500 border-r-[6px] border-indigo-700/90` // Active link styling
                  : `hover:bg-gray-200 hover:border-r-[6px] hover:border-gray-900/70` // Hover styling
              }`
            }
          >
            {/* Icon for the menu item */}
            <img src={item.icon} alt="" className="w-6 h-6" />
            {/* Menu item text, hidden on smaller screens */}
            <p className="md:block hidden text-center text-gray-900">
              {item.name}
            </p>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default Sidebar;

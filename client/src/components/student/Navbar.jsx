import React, { useContext } from "react"; // Importing necessary React hooks
import { assets } from "../../assets/assets"; // Importing assets (like logos and icons)
import { Link } from "react-router-dom"; // Importing Link for routing
import {
  UserButton, // Component from Clerk for user authentication
  useClerk, // Hook to manage Clerk session
  useUser, // Hook to get user details from Clerk
} from "@clerk/clerk-react"; // Clerk authentication library
import { AppContext } from "../../context/AppContext"; // Importing AppContext for global state
import axios from "axios"; // Importing axios for making HTTP requests
import { toast } from "react-toastify"; // Importing toast notifications
import { Bounce } from "react-toastify"; // Importing Bounce transition for toast notifications

const Navbar = () => {
  // Destructuring values from AppContext (for navigation, user role, backend URL, etc.)
  const { navigate, isEducator, setIsEducator, backendUrl, getToken } = useContext(AppContext);

  // Checking if the current page is the course list page
  const isCourseListPage = location.pathname.includes("/course-list");

  // Accessing Clerk's user and sign-in functionality
  const { openSignIn } = useClerk();
  const { user } = useUser();

  // Function to handle becoming an educator
  const becomeEducator = async () => {  
    try {
      // If already an educator, navigate to the educator dashboard
      if (isEducator) {
        navigate('/educator/dashboard');
        return;
      }

      // Getting the token for making an authenticated API request
      const token = await getToken();

      // Making an API call to update the user's role to educator
      const { data } = await axios.get(`${backendUrl}/api/educator/update-role`, {
        headers: {
          'Authorization': `Bearer ${token}` // Passing token in the request header
        }
      });

      // Handling success or failure based on the response from the backend
      if (data.success) {
        setIsEducator(true); // Setting the educator status in global state
        toast.success(data.message, { // Displaying success toast
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce, // Using the Bounce transition for the toast
        });
      } else {
        toast.error(data.message, { // Displaying error toast if the request fails
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error); // Logging error if any occurs
      toast.error(error.message, { // Displaying error toast in case of an exception
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-between py-4 px-4 sm:px-10 md:px-14 lg:px-36 border-b border-white ${
        isCourseListPage ? "bg-slate-800" : "bg-cyan-200/70" // Conditionally changing navbar background based on the page
      } `}
    >
      {/* Logo section with dynamic image source */}
      <img onClick={() => navigate('/')} src={isCourseListPage ? assets.logo_dark : assets.logo} className="w-28 lg:w-32 cursor-pointer" />

      {/* Desktop view - Navbar items */}
      <div className="hidden md:flex items-center gap-5 text-gray-100">
        <div className="flex items-center gap-4 text-[16px]">
          {user && (
            <>
              {/* Conditional rendering for logged-in users */}
              <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> |
              <Link to={"/my-enrollments"}>My Enrollments</Link>
            </>
          )}
        </div>
        {/* Displaying User Button or Sign-In Button based on the user status */}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()} // Opens the sign-in modal
            className="bg-blue-700 text-white px-5 py-2 text-base rounded-full cursor-pointer"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile view - Navbar items */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-100">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              {/* Conditional rendering for logged-in users */}
              <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> |
              <Link to={"/my-enrollments"}> My Enrollments</Link>
            </>
          )}
        </div>
        {/* Displaying User Button or Sign-In Button based on the user status */}
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}> {/* Button for signing in */}
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar; // Exporting the Navbar component

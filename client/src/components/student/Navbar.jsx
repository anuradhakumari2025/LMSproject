import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import {
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const {navigate,isEducator,setIsEducator} = useContext(AppContext)
  const isCourseListPage = location.pathname.includes("/course-list");
  const { openSignIn } = useClerk();
  const { user } = useUser();
  return (
    <div
      className={`flex items-center justify-between py-4 px-4 sm:px-10 md:px-14  lg:px-36 border-b border-white ${
        isCourseListPage ? "bg-slate-700" : "bg-cyan-200/70"
      } `}
    >
      <img onClick={()=> navigate('/')} src={assets.logo} className="w-28 lg:w-32 cursor-pointer" />

      {/* Laptop view */}
      <div className="hidden md:flex items-center gap-5 text-gray-100">
        <div className="flex items-center gap-4 text-[16px]">
          {user && (
            <>
              <button onClick={() => {navigate('/educator/educator')}}>{isEducator? 'Educator Dashboard':'Become Educator'}</button> |
              <Link to={"/my-enrollments"}>My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-700 text-white px-5 py-2 text-base rounded-full cursor-pointer"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile view */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-100">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={() => {navigate('/educator/educator')}}>{isEducator? 'Educator Dashboard':'Become Educator'}</button>  |
              <Link to={"/my-enrollments"}> My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={()=>openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

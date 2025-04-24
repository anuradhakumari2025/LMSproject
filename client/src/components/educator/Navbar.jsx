import React from 'react'
import { Link } from 'react-router-dom'
import { assets, dummyEducatorData } from '../../assets/assets'
import { useUser, UserButton } from '@clerk/clerk-react'

// Navbar component
const Navbar = () => {
  // Dummy educator data from assets
  const educatorData = dummyEducatorData;

  // Get current user info from Clerk
  const { user } = useUser();

  return (
    // Navbar wrapper with spacing, border, and background
    <div className='flex justify-between items-center px-4 md:px-16 border-b border-gray-300 py-3 bg-slate-700'>

      {/* Logo section wrapped in Link to home route */}
      <Link to='/'>
        <img src={assets.logo_dark} alt="" className='w-28 lg:w-32' />
      </Link>

      {/* Right section with greeting and user icon/button */}
      <div className='flex items-center gap-5 relative'>
        {/* Greeting text showing user full name if logged in */}
        <p className='text-gray-200'> Hi! {user ? user.fullName : 'Developers'}</p>

        {/* Show Clerk UserButton if logged in, otherwise show default profile image */}
        {user ? <UserButton /> :
        <img src={assets.profile_img} alt='' className='max-w-8' />}
      </div>

    </div>
  )
}

export default Navbar

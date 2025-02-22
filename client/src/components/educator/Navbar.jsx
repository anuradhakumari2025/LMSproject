import React from 'react'
import { Link } from 'react-router-dom'
import { assets, dummyEducatorData } from '../../assets/assets'
import {useUser,UserButton} from '@clerk/clerk-react'

const Navbar = () => {
  const educatorData = dummyEducatorData
  const {user} = useUser()
  return (
    <div className='flex justify-between items-center px-4 md:px-16 border-b border-gray-300 py-3 bg-slate-700'>
      <Link to='/'>
      <img src={assets.logo_dark} alt="" className='w-28 lg:w-32' />
      </Link>
      <div className='flex items-center gap-5 relative'>
        <p className='text-gray-200'> Hi! {user ? user.fullName : 'Developers'}</p>
        {user?<UserButton/>:
        <img src={assets.profile_img} alt='' className='max-w-8'/>}
      </div>

    </div>
  )
}

export default Navbar
import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-6'>
      <p className='text-base text-gray-50'>Trusted by learners from</p>
      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5'>
        <img src={assets.microsoft_logo} alt=""  className='w-20 mid:w-28'/>
        <img src={assets.accenture_logo} alt=""  className='w-20 mid:w-28'/>
        <img src={assets.adobe_logo} alt=""  className='w-20 mid:w-28'/>
        <img src={assets.walmart_logo} alt=""  className='w-20 mid:w-28'/>
        <img src={assets.paypal_logo} alt=""  className='w-20 mid:w-28'/>
      </div>
    </div>
  )
}

export default Companies
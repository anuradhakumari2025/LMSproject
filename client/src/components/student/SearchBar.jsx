import React from 'react'
import { assets } from '../../assets/assets'

const SearchBar = () => {
  return (
    <div>
      <form action="">
        <img src={assets.search_icon} alt="" className='md:w-auto w-10 px-3' />
      </form>
    </div>
  )
}

export default SearchBar
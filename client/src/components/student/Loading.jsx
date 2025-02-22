import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur'>
      <div className='w-10 sm:w-14 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading
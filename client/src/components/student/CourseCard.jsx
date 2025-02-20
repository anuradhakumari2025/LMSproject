import React, { useContext } from 'react'
import { assets, dummyCourses } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {
  const {currency,calculateRating} = useContext(AppContext)
  return (
    <Link onClick={()=>scrollTo(0,0)} to={'/course/' + course._id} className='border border-white overflow-hidden rounded-lg pb-6 shadow-lg shadow-gray-500 hover:border-4 hover:border-white hover:scale-110 transition-all duration-200'>
      <img src={course.courseThumbnail} alt="" className='w-full'/>
      <div className='p-3 text-left'>
        <h3 className='text-gray-50 text-base font-semibold '>{course.courseTitle}</h3>
         <p className='text-gray-50'>Anuradha</p>
        <div className='flex items-center space-x-3 text-gray-50'>
          <p className='text-yellow-400'>{calculateRating(course)}</p>
          <div className='flex'>
            {
              [...Array(5)].map((_,i)=>(
                <img key={i} src={ i < calculateRating(course) ?assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5'/>
              ))
            }
          </div>
          <p className='text-yellow-100'>{course.courseRatings.length}</p>
        </div>
        <p className='text-teal-300'>{currency}{(course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default CourseCard
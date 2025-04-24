import React, { useContext } from 'react'
import { assets, dummyCourses } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {
  // Destructuring context values
  const {currency, calculateRating} = useContext(AppContext)

  // Logging course data for debugging
  console.log("course", course);
  
  // Fallback in case courseRatings is undefined
  const courseRatings = course.courseRatings || [];

  return (
    // Entire course card is a clickable link to the course detail page
    <Link 
      onClick={() => scrollTo(0, 0)}  // Scroll to top on click
      to={'/course/' + course._id}   // Navigate to course detail using course ID
      className='border border-white overflow-hidden rounded-lg pb-6 shadow-lg shadow-gray-500 hover:border-4 hover:border-white hover:scale-110 transition-all duration-200'
    >
      {/* Course thumbnail */}
      <img src={course.courseThumbnail} alt="" className='w-full'/>

      {/* Course details section */}
      <div className='p-3 text-left'>
        {/* Course title */}
        <h3 className='text-gray-50 text-base font-semibold '>{course.courseTitle}</h3>

        {/* Educator's first name */}
        <p className='text-gray-50'>{course?.educator?.name.split(" ")[0]}</p>

        {/* Rating section */}
        <div className='flex items-center space-x-3 text-gray-50'>
          {/* Display numeric rating */}
          <p className='text-yellow-400'>{calculateRating(course)}</p>

          {/* Star icons for rating visualization */}
          <div className='flex'>
            {
              [...Array(5)].map((_, i) => (
                <img 
                  key={i} 
                  src={i < calculateRating(course) ? assets.star : assets.star_blank} 
                  alt='' 
                  className='w-3.5 h-3.5'
                />
              ))
            }
          </div>

          {/* Total number of ratings */}
          <p className='text-yellow-100'>{courseRatings.length}</p>
        </div>

        {/* Display discounted price */}
        <p className='text-teal-300'>
          {currency}{(course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

export default CourseCard

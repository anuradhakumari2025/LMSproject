import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext"; // Importing AppContext for accessing global data
import SearchBar from "../../components/student/SearchBar"; // Importing SearchBar component
import { useParams } from "react-router-dom"; // Importing useParams to access URL parameters
import CourseCard from "../../components/student/CourseCard"; // Importing CourseCard component to display individual courses
import { assets } from "../../assets/assets"; // Importing assets for static files like icons
import Footer from "../../components/student/Footer"; // Importing Footer component

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext); // Extracting navigate function and allCourses from AppContext
  const { input } = useParams(); // Extracting input from URL parameters for search filtering
  const [filteredCourse, setFilteredCourse] = useState([]); // State to store the filtered courses based on search

  // useEffect hook to filter courses whenever 'allCourses' or 'input' changes
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice(); // Create a copy of allCourses to avoid direct mutation
      // Filter courses based on the input search query
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase()) // Check if course title includes the search term
            )
          )
        : setFilteredCourse(tempCourses); // If no input, display all courses
    }
  }, [allCourses, input]); // Dependency array to run the effect when allCourses or input changes

  return (
    <>
      <div className="relative md:px-36 px-8 py-20 text-left">
        {/* Page heading and breadcrumb */}
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-3xl font-semibold text-gray-100">
              Course List
            </h1>
            <p className="text-gray-100">
              <span
                onClick={() => {
                  navigate("/"); // Navigate to the homepage when the Home link is clicked
                }}
                className="text-blue-500 cursor-pointer"
              >
                Home
              </span>
              /<span> Course List</span>
            </p>
          </div>
          {/* Search bar component for course searching */}
          <SearchBar data={input} />
        </div>

        {/* Show the search term input and allow clearing it */}
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-100">
            <p>{input}</p> {/* Display the current search term */}
            <img
              src={assets.cross_icon} // Cross icon to clear the search input
              alt="clear search"
              onClick={() => {
                navigate("/course-list"); // Clear the search input and navigate to the course list page
              }}
              className="cursor-pointer"
            />
          </div>
        )}

        {/* Render the filtered courses in a responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-5 md:p-0 px-2">
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} /> // Display each course as a CourseCard component
          ))}
        </div>
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default CoursesList;

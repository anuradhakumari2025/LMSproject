import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  // Accessing allCourses from AppContext
  const { allCourses } = useContext(AppContext);

  return (
    <div className="pt-16 md:px-40 px-8">
      {/* Heading for the section */}
      <h2 className="text-3xl font-medium text-gray-100">
        Learn from the best
      </h2>

      {/* Description under the heading */}
      <p className="text-sm md:text-base text-gray-400 mt-3">
        Unlock your potential with courses designed by industry experts.<br/>  
        Gain practical skills, hands-on experience, and certifications to excel in your career.
      </p>

      {/* Grid layout for displaying a subset of courses */}
      <div className="grid grid-cols-auto-fit px-4 md:px-0 md:my-16 gap-6 my-8">
        {/* Render first 4 courses using CourseCard component */}
        {allCourses.slice(0, 4).map((course, idx) => (
          <CourseCard course={course} key={idx}/>
        ))}
      </div>

      {/* Link to navigate to full course list page */}
      <Link
        to={"/course-list"}
        onClick={() => scrollTo(0, 0)} // Scroll to top when navigating
        className="text-white border border-gray-300 px-19 py-2 rounded"
      >
        Show all courses
      </Link>
    </div>
  );
};

export default CoursesSection;

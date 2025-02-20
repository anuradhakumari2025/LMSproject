import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const { allCourses,calculateRating } = useContext(AppContext);
  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };
  useEffect(() => {
    fetchCourseData();
  }, []);
  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 text-left md:pt-30">
        <div className="absolute top-0 left-0 w-full h-[500px] z-1 bg-gradient-to-b from-cyan-200/70"></div>
        {/* left column */}
        <div className="max-w-xl z-10">
          <h1 className="text-gray-50 md:text-4xl text-2xl font-semibold ">
            {courseData.courseTitle}
          </h1>
          <p
            className="text-gray-300 pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>

          {/* review and ratings */}
          <div className="flex items-center space-x-3 text-gray-50 my-4">
            <p className="text-yellow-400">{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < calculateRating(courseData)
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-blue-400">
              ({courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
            </p>
            <p>
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "Students" : "Student"}
            </p>
          </div>
          <p className="text-gray-300">
            Course by <span className="text-blue-500 underline">Anuradha</span>
          </p>
        </div>
        {/* right column */}
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;

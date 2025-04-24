import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext"; // Importing context for global state
import Loading from "../../components/student/Loading"; // Importing Loading component for when data is being fetched
import { Bounce } from "react-toastify"; // Importing the Bounce transition for toast notifications
import { toast } from "react-toastify"; // Importing toast for showing notifications
import axios from "axios"; // Importing axios for making HTTP requests

const MyCourses = () => {
  // Destructuring necessary values from context
  const { currency, allCourses, backendUrl, isEducator, getToken } = useContext(AppContext);
  
  const [courses, setCourses] = useState(null); // State to store fetched courses

  // Function to fetch courses for educators
  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken(); // Getting the token to authorize the request
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: {
          Authorization: `Bearer ${token}`, // Adding token in request headers for authentication
        },
      });

      if (data.success) {
        setCourses(data.courses); // Updating state with the fetched courses
      } else {
        // Showing error toast if the API response is unsuccessful
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce, // Using Bounce transition for toast
        });
      }
    } catch (error) {
      console.log(error); // Logging error in console
      // Showing error toast if there is an exception during the request
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce, // Using Bounce transition for toast
      });
    }
  };

  // useEffect hook to fetch courses when the educator is authenticated
  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses(); // Call the function to fetch courses if the user is an educator
    }
  }, [isEducator]); // Dependency array to re-fetch when 'isEducator' changes

  // Return the component to display
  return courses ? (
    <div className="px-4 bg-slate-600 pt-8 pb-0 min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-10">
      <div className="w-full px-4 pb-4">
        <h2 className="pb-4 text-2xl font-medium text-white">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-slate-800 border border-white">
          <table className="md:table-auto table-fixed w-full overflow-hidden ">
            <thead className="text-gray-100 border-b border-gray-50 text-sm text-left">
              <tr>
                {/* Table headers for course information */}
                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
              {/* Loop through the courses and display each course details */}
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-400">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    {/* Display course thumbnail and title */}
                    <img src={course.courseThumbnail} alt="" className="w-16" />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3">
                    {/* Calculate and display course earnings */}
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice - 
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3 md:px-8">
                    {/* Display number of students enrolled in the course */}
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3 md:px-5">
                    {/* Display the date the course was published */}
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading /> // Display Loading component while data is being fetched
  );
};

export default MyCourses; // Exporting MyCourses component for use

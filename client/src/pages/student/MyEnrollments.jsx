import React, { useContext, useEffect, useState } from "react"; // Importing necessary libraries and hooks
import { AppContext } from "../../context/AppContext"; // Importing context for app-wide state
import { Line } from "rc-progress"; // Importing Line component for progress bar
import Footer from "../../components/student/Footer"; // Importing Footer component
import axios from "axios"; // Importing axios for HTTP requests
import { toast } from "react-toastify"; // Importing toast for notifications
import { Bounce } from "react-toastify"; // Importing Bounce transition for toast notifications

const MyEnrollments = () => {
  const {
    enrolledCourses, // All the courses user is enrolled in
    calculateCourseDuration, // Function to calculate course duration
    navigate, // Function to navigate between pages
    userData, // User data from context
    fetchUserEnrolledCourses, // Function to fetch enrolled courses
    backendUrl, // Backend URL to interact with the API
    getToken, // Function to get the authentication token
    calculateNoOfLectures, // Function to calculate the number of lectures in a course
  } = useContext(AppContext); // Using context to access app-wide data and functions

  const [progressArray, setProgressArray] = useState([]); // State to store course progress data

  // Function to get the progress of each course
  const getCourseProgress = async () => {
    try {
      const token = await getToken(); // Fetching the auth token
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          // Sending POST request to fetch course progress data from the backend
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Passing token in the header for authorization
              },
            }
          );
          let totalLectures = calculateNoOfLectures(course); // Calculating total lectures in the course
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length // Counting completed lectures
            : 0;
          return { totalLectures, lectureCompleted }; // Returning progress data for each course
        })
      );
      setProgressArray(tempProgressArray); // Setting the progress array in state
    } catch (error) {
      // If there's an error, show a toast notification with the error message
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce, // Toast transition style
      });
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses(); // Fetch courses if user data is available
    }
  }, [userData]); // Dependency on userData, triggers re-fetching when user data is updated

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress(); // Fetch course progress when courses are available
    }
  }, [enrolledCourses]); // Dependency on enrolledCourses, triggers progress fetching when courses list is updated

  return (
    <>
      <div className="md:px-36 px-8 pt-10 pb-26">
        <h1 className="text-2xl font-semibold text-white">My Enrollments</h1> {/* Title for My Enrollments section */}
        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10 text-gray-200">
          <thead className="text-gray-200 border-b border-gray-50 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th> {/* Column for course title */}
              <th className="px-4 py-3 font-semibold truncate">Duration</th> {/* Column for course duration */}
              <th className="px-4 py-3 font-semibold truncate">Completed</th> {/* Column for completed lectures */}
              <th className="px-4 py-3 font-semibold truncate">Status</th> {/* Column for status (completed/ongoing) */}
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {enrolledCourses?.map((course, index) => (
              <tr key={index} className="border-b border-gray-500">
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                  <img
                    src={course.courseThumbnail} // Course thumbnail
                    alt=""
                    className="w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">{course.courseTitle} </p> {/* Course title */}
                    <Line
                      strokeWidth={2} // Progress bar width
                      percent={ // Calculating percentage progress based on lectures completed
                        progressArray[index]
                          ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures
                          : 0
                      }
                      className="bg-gray-300 rounded-full mt-2"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(course)} {/* Displaying course duration */}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[index] &&
                    `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}{" "}
                  <span>Lectures</span> {/* Displaying number of completed lectures */}
                </td>
                <td className="px-4 py-3 max-sm:text-right">
                  <button
                    onClick={() => {
                      navigate("/player/" + course._id); // Navigate to the course player page
                    }}
                    className={`text-white px-3 sm:px-5 py-1.5 sm:py-2
                    ${
                      progressArray[index] &&
                      progressArray[index].lectureCompleted === progressArray[index].totalLectures
                        ? "bg-green-500" // Green button for completed courses
                        : "bg-blue-600" // Blue button for ongoing courses
                    }
                    max-sm:text-xs`}
                  >
                    {progressArray[index] &&
                    progressArray[index].lectureCompleted === progressArray[index].totalLectures
                      ? "Completed" // Display "Completed" if course is finished
                      : "On Going"} // Display "On Going" if course is not finished
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer /> {/* Rendering the Footer component */}
    </>
  );
};

export default MyEnrollments; // Exporting MyEnrollments component

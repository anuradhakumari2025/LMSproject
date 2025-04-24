import { createContext, useEffect, useState } from "react"; // Import necessary hooks and libraries
import { dummyCourses } from "../assets/assets"; // Import dummy courses (used for mock data)
import { useNavigate } from "react-router-dom"; // Import navigate hook to programmatically navigate
import humanizeDuration from "humanize-duration"; // Import library to humanize time durations
import { useAuth, useUser } from "@clerk/clerk-react"; // Import authentication hooks from Clerk
import axios from "axios"; // Import axios for making HTTP requests
import { toast } from "react-toastify"; // Import toast for showing notifications
import { Bounce } from "react-toastify"; // Import transition effect for toast notifications

// Creating AppContext using React Context API
export const AppContext = createContext();

// AppContextProvider component to provide context to its children
export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Fetch backend URL from environment variables
  const currency = import.meta.env.VITE_CURRENCY; // Fetch currency from environment variables
  const navigate = useNavigate(); // Initialize navigate function
  const { getToken } = useAuth(); // Access the getToken method from Clerk for authentication
  const { user } = useUser(); // Get user information from Clerk

  // State variables to store course and user data
  const [allCourses, setAllCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);

  // Function to fetch all courses from the backend
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");
      if (data.success) {
        setAllCourses(data.courses); // Set the state with fetched courses
      } else {
        // Show error toast if fetching courses fails
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      // Show error toast for any error during the fetch
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Function to fetch user data
  const fetchUserData = async () => {
    if (user.publicMetadata.role === "educator") {
      setIsEducator(true); // Set the isEducator state based on user role
    }
    try {
      const token = await getToken(); // Get the JWT token for the authenticated user
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });
      if (data.success) {
        setUserData(data.user); // Set the state with fetched user data
      } else {
        // Show error toast if fetching user data fails
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      // Show error toast for any error during the fetch
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Function to fetch enrolled courses for the user
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken(); // Get the JWT token for the authenticated user
      const { data } = await axios.get(backendUrl + "/api/user/enrolled-courses", {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse()); // Set the enrolled courses state
      } else {
        // Show error toast if fetching enrolled courses fails
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      // Show error toast for any error during the fetch
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Function to calculate course rating
  const calculateRating = (course) => {
    if (
      !course ||
      !Array.isArray(course.courseRatings) ||
      course.courseRatings.length === 0
    ) {
      return 0; // Return 0 if courseRatings is undefined, not an array, or empty
    }
    let totalRating = 0;
    course?.courseRatings?.forEach((rating) => {
      totalRating += rating.rating; // Summing up all ratings
    });
    return Math.floor(totalRating / course.courseRatings.length); // Return the average rating
  };

  // Function to calculate the time of a chapter
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter?.chapterContent.map((lecture) => (time += lecture.lectureDuration)); // Summing up lecture durations in a chapter
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] }); // Returning humanized time
  };

  // Function to calculate the total duration of a course
  const calculateCourseDuration = (course) => {
    let time = 0;
    course?.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration)) // Summing up all lecture durations in the course
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] }); // Returning humanized time
  };

  // Function to calculate the total number of lectures in a course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length; // Counting all lectures in all chapters
      }
    });
    return totalLectures; // Returning total number of lectures
  };

  // Fetching all courses when the component is mounted
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Fetching user data and enrolled courses whenever the user changes
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  // Value to provide to the AppContext
  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    fetchAllCourses,
    getToken,
  };

  // Providing context to children components
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

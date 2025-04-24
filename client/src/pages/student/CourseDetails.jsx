import React, { use, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams(); // Extracts the course ID from the URL
  const [courseData, setCourseData] = useState(null); // Stores course details
  const [openSection, setOpenSection] = useState({}); // Keeps track of which section is open
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false); // Checks if the user is enrolled in the course
  const [playerData, setPlayerData] = useState(null); // Stores player data for YouTube video
  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    backendUrl,
    userData,
    navigate,
    getToken,
    setUserData,
  } = useContext(AppContext); // Extracts necessary data and methods from context

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID; // Retrieves Razorpay API key from environment variables

  // Fetch course data from the backend API
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id); // Get course data from the backend
      console.log("course details", data);
      if (data.success) {
        setCourseData(data.courseData); // If the course data is fetched successfully, set it to state
      } else {
        toast.error(data.message, { // Display error if course fetch fails
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
      console.log(error); // Log any error that occurs
      toast.error(error.message, { // Display error if something goes wrong with the fetch
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

  // Function to handle course enrollment
  const enrolledCourse = async () => {
    try {
      if (!userData) { // If user is not logged in, show a warning
        return toast.warn("Login to Enroll", {
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
      if (isAlreadyEnrolled) { // If the user is already enrolled in the course, show a warning
        return toast.warn("Already Enrolled", {
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

      const token = await getToken(); // Get the authentication token for the request
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase-course", // API call to enroll in the course
        {
          courseId: courseData._id, // Pass course ID in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers for authentication
          },
        }
      );
      console.log("enrolled Course ", data);
      if (data.success) { // If course enrollment is successful
        const options = {
          key: razorpayKeyId, // Set Razorpay payment gateway options
          amount: data.amount,
          currency: data.currency,
          name: "Anuradha",
          description: `Payment for ${courseData.courseTitle}`,
          order_id: data.orderId,
          handler: async function (response) { // Handler function after payment is made
            console.log("Payment Successful:", response);

            // Verify payment on the backend
            const verifyResponse = await axios.post(
              backendUrl + "/api/user/verify-payment",
              {
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Include token for authentication
                },
              }
            );

            if (verifyResponse.data.success) { // If payment verification is successful
              toast.success(
                "Payment verified and course enrolled successfully!",
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  transition: Bounce,
                }
              );
              setIsAlreadyEnrolled(true); // Update the state to reflect successful enrollment

              // Fetch updated user data after enrollment
              const updatedUserData = await axios.get(
                backendUrl + "/api/user",
                {
                  headers: {
                    Authorization: `Bearer ${token}`, // Include token to authenticate the request
                  },
                }
              );

              setUserData(updatedUserData.data.user); // Update global user data state

              // Redirect user to their enrollments page
              navigate("/my-enrollments");
            } else {
              toast.error(
                "Payment verification failed. Please contact support.",
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  transition: Bounce,
                }
              );
            }
          },
          prefill: {
            name: userData.name.split(" ")[0], // Pre-fill payment form with user info
            email: userData.email,
            contact: userData.contact || "",
          },
          theme: {
            color: "#3399cc", // Customize the payment button color
          },
        };

        const razorpay = new window.Razorpay(options); // Create a new Razorpay instance with options
        razorpay.open(); // Open the Razorpay payment modal
      } else {
        toast.error(data.message, { // Show error message if course enrollment fails
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
      console.log(error); // Log any error that occurs during the process
      toast.error(error.message, { // Show error message if something goes wrong
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

  // Fetch course data when component mounts
  useEffect(() => {
    fetchCourseData();
  }, []);

  // Check if the user is already enrolled in the course whenever userData or courseData changes
  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id)); // Update enrollment status
    }
  }, [userData, courseData]);

  // Function to toggle the visibility of a course section
  const toggleFunction = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      {/* Render course details */}
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 text-left md:pt-16">
        <div className="absolute top-0 left-0 w-full h-[500px] z-1 bg-gradient-to-b from-cyan-200/70"></div>

        {/* Left column for course details */}
        <div className="max-w-xl z-10">
          <h1 className="text-gray-900 md:text-4xl text-2xl font-semibold ">
            {courseData.courseTitle}
          </h1>
          <p
            className="text-gray-800 pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>

          {/* Display review and ratings */}
          <div className="flex items-center space-x-3 text-gray-50 my-4">
            <div className="flex items-center space-x-1">
              {/* Display average rating */}
              {calculateRating(courseData)}{" "}
              <span className="text-xs"> ({courseData.totalRatings} ratings)</span>
            </div>
            <div className="flex items-center space-x-1">
              {/* Display course duration */}
              {calculateCourseDuration(courseData.courseDuration)}
            </div>
          </div>
        </div>

        {/* Right column for course image */}
        <div className="max-w-xl flex flex-col gap-4 items-center justify-center ">
          <img
            className="rounded-2xl shadow-xl"
            src={assets.imagePath + "/" + courseData.courseImage}
            alt={courseData.courseTitle}
          />
          <button
            onClick={enrolledCourse} // Calls enrolledCourse function when clicked
            className="rounded-md bg-gradient-to-r py-4 px-8 w-full text-lg text-white font-bold"
          >
            {isAlreadyEnrolled ? "Go to Course" : "Enroll Now"}
          </button>
        </div>
      </div>

      {/* Render YouTube video if available */}
      {courseData.courseVideoUrl && (
        <div className="flex justify-center">
          <YouTube videoId={playerData?.id} />
        </div>
      )}

      {/* Render course content (chapters and lectures) */}
      <div className="flex flex-col md:px-36 px-8 py-16">
        {courseData.courseContent.map((chapter, index) => (
          <div key={index}>
            <div
              className="cursor-pointer text-xl text-left"
              onClick={() => toggleFunction(index)}
            >
              {chapter.chapterTitle}
            </div>
            <div
              className={`${
                openSection[index] ? "block" : "hidden"
              } pl-5`}
            >
              {chapter.lectures.map((lecture, idx) => (
                <div key={idx}>{lecture.lectureTitle}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  ) : (
    <Loading /> // Render loading state until course data is fetched
  );
};

export default CourseDetails;

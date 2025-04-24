import React, { useContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import Loading from "../../components/student/Loading";
import axios from "axios";

const Player = () => {
  const [courseData, setCourseData] = useState(null); // Holds the course data
  const { courseId } = useParams(); // Gets the course ID from the URL params
  const [openSection, setOpenSection] = useState({}); // Manages open/close state for course sections
  const [playerData, setPlayerData] = useState(null); // Holds the current lecture/player data
  const [progressData, setProgressData] = useState(null); // Holds the progress data for the course
  const [initialRating, setInitialRating] = useState(0); // Holds the initial rating for the course

  const {
    calculateChapterTime,
    enrolledCourses,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext); // Extracts values and functions from context

  // Function to fetch course data based on course ID
  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course); // Set the course data
        if (course.courseContent) {
          course.courseRatings?.map((item) => {
            if (item.userId === userData._id) {
              setInitialRating(item.rating); // Set the initial rating for the course
            }
          });
        } else {
          console.log("Course content not available for this course.");
        }
      }
    });
  };

  // Toggles the open/close state for sections
  const toggleFunction = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Fetch user enrolled courses when component mounts
  useEffect(() => {
    fetchUserEnrolledCourses(); // Fetch the latest enrolled courses
  }, []);

  // Get the course data after enrolled courses are fetched
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  // Function to fetch course progress
  const getCourseProgress = async () => {
    try {
      const token = await getToken(); // Get the user token for authorization
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setProgressData(data.progressData); // Set progress data
        toast.success(data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
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
      console.log(error);
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

  // Function to mark a lecture as completed
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message, {
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
        getCourseProgress(); // Fetch the updated course progress
      } else {
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
      console.log(error);
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

  // Function to handle course rating submission
  const handleRating = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        {
          courseId,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        fetchUserEnrolledCourses(); // Refresh the list of enrolled courses
      } else {
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
      console.log(error);
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

  useEffect(() => {
    getCourseProgress(); // Fetch course progress when component mounts
  }, []);

  return courseData ? (
    <>
      <div className="p-4 mb-10 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-16">
        {/* left column */}
        <div className="text-gray-200">
          <div className="py-4">
            <h2 className="font-semibold text-xl text-gray-200">
              Course Structure
            </h2>
            <div className="space-y-4 my-6">
              {courseData &&
                courseData.courseContent &&
                courseData.courseContent?.map((chapter, index) => (
                  <div
                    key={index}
                    className="border border-gray-600 rounded shadow-md shadow-gray-400"
                  >
                    <div
                      className=" cursor-pointer flex select-none justify-between items-center px-4 py-2 bg-white"
                      onClick={() => toggleFunction(index)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          className={`transform transition-transform ${
                            openSection[index] ? "rotate-180" : ""
                          }`}
                          src={assets.down_arrow_icon}
                          alt=""
                        />
                        <p className="text-gray-900 text-sm font-medium md:text-base">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-gray-500 font-normal text-sm md:text-normal">
                        {chapter.chapterContent.length} lectures -{" "}
                        {calculateChapterTime(chapter)}
                      </p>
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openSection[index] ? "max-h-96" : "max-h-0"
                      } bg-slate-500/70`}
                    >
                      <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-grey-600 border-t border-gray-300">
                        {chapter.chapterContent?.map(
                          (lecture, lectureIndex) => (
                            <li
                              key={lectureIndex}
                              className="flex items-start gap-2 py-1"
                            >
                              <img
                                src={
                                  progressData &&
                                  progressData?.lectureCompleted?.includes(
                                    lecture?.lectureId
                                  )
                                    ? assets.blue_tick_icon
                                    : assets.play_icon
                                }
                                alt="play icon"
                                className=" h-4 mt-1 w-4"
                              />
                              <div className="flex items-center justify-between w-full text-gray-300 md:text-base text-xs">
                                <p>{lecture.lectureTitle}</p>
                                <div className="flex gap-2">
                                  {lecture.lectureUrl && (
                                    <p
                                      onClick={() =>
                                        setPlayerData({
                                          ...lecture,
                                          chapter: index + 1,
                                          lecture: lectureIndex + 1,
                                        })
                                      }
                                      className="text-blue-400 cursor-pointer"
                                    >
                                      Watch
                                    </p>
                                  )}
                                  <p>
                                    {humanizeDuration(
                                      lecture.lectureDuration * 60 * 1000,
                                      { units: ["h", "m"] }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-10 py-3">
            <h1 className="font-bold text-xl text-gray-100">
              Rate this Course
            </h1>
            <Rating initialRating={initialRating} onRate={handleRating} />
          </div>
        </div>
        {/* right column */}
        <div>
          {playerData ? (
            <div className="md:mt-10">
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-4 text-gray-300">
                <p>
                  {playerData.chapter} . {playerData.lecture}
                  {playerData.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className="text-blue-500"
                >
                  {progressData &&
                  progressData.lectureCompleted.includes(playerData.lectureId)
                    ? "Completed"
                    : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : courseData && courseData.courseThumbnail ? (
            <img src={courseData.courseThumbnail} alt="Course Thumbnail" />
          ) : (
            <p className="text-gray-400">No course thumbnail available</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;

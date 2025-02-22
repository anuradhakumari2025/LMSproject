import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
  } = useContext(AppContext);
  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };
  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);

  const toggleFunction = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 text-left md:pt-16">
        <div className="absolute top-0 left-0 w-full h-[500px] z-1 bg-gradient-to-b from-cyan-200/70"></div>

        {/* left column */}
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
              ({courseData.courseRatings.length}
              {courseData.courseRatings.length > 1 ? " ratings" : " rating"})
            </p>
            <p>
              {courseData.enrolledStudents.length}
              {courseData.enrolledStudents.length > 1
                ? " Students"
                : " Student"}
            </p>
          </div>
          <p className="text-gray-300">
            Course by <span className="text-blue-500 underline">Anuradha</span>
          </p>
          <div className="pt-6">
            <h2 className="font-semibold text-xl text-gray-200">
              Course Structure
            </h2>
            <div className="space-y-4 my-6">
              {courseData.courseContent.map((chapter, index) => (
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
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <li key={lectureIndex} className="flex items-start gap-2 py-1">
                          <img
                            src={assets.play_icon}
                            alt="play icon"
                            className=" h-4 mt-1 w-4"
                          />
                          <div className="flex items-center justify-between w-full text-gray-300 md:text-base text-xs">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-blue-400 cursor-pointer"
                                >
                                  Preview
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
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-12 text-sm md:text-base">
            <h3 className="text-2xl font-bold text-white">
              Course Description
            </h3>
            <p
              className="pt-4 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></p>
          </div>
        </div>
        {/* right column */}

        <div className="max-w-course-card z-10 shadow-gray-400 shadow-md rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{
                playerVars: {
                  autoplay: 1,
                },
              }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="" className="" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-2">
              <img className="w-3.5" src={assets.time_left_clock_icon} alt="" />

              <p className="text-red-600 text-sm md:text-base">
                <span className="font-medium">5 days</span> left at this price
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="md:text-2xl text-xl font-bold">
                {currency}{" "}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}{" "}
              </p>
              <p className="line-through font-normal md:text-base text-sm">
                {currency} {courseData.coursePrice}{" "}
              </p>
              <p className="font-normal md:text-base text-sm text-green-500">
                {courseData.discount}% off{" "}
              </p>
            </div>
            <div className="flex items-center gap-4 md:text-base md:pt-4 pt-2 text-gray-500">
              <div className="flex items-center gap-2">
                <img src={assets.star} alt="starIcon" />
                <p>{calculateRating(courseData)} </p>
              </div>
              <div className="h-4  bg-gray-500 w-px"></div>
              <div className="flex items-center gap-2">
                <img src={assets.time_clock_icon} alt="" />
                <p>{calculateCourseDuration(courseData)} </p>
              </div>
              <div className="h-4  bg-gray-500 w-px"></div>
              <div className="flex items-center gap-2">
                <img src={assets.lesson_icon} alt="" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>

            <button className="w-full px-5 font-medium rounded bg-blue-600 py-2 mt-4 md:mt-6 text-white ">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}{" "}
            </button>

            <div className="pt-6">
              <p className="font-medium md:text-xl text-lg text-gray-800">
                What's in the course
              </p>
              <ul className="list-disc md:text-base text-sm ml-4 text-gray-500">
                <li>Lifetime access with free updates</li>
                <li>Step-by-step, hands on project guidance</li>
                <li>Downloadable resources and source code</li>
                <li>Quizzes to test your knowledge</li>
                <li>Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;

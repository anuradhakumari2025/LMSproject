import React, { useContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";

const Player = () => {
  const [courseData, setCourseData] = useState(null);
  const { courseId } = useParams();
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const {
    calculateChapterTime,
    enrolledCourses,
  } = useContext(AppContext);

  const getCourseData = async () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
      }
    });
  };

  const toggleFunction = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses]);

  return (
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
                courseData.courseContent.map((chapter, index) => (
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
                          <li
                            key={lectureIndex}
                            className="flex items-start gap-2 py-1"
                          >
                            <img
                              src={
                                false ? assets.blue_tick_icon : assets.play_icon
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
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-10 py-3">
            <h1 className="font-bold text-xl text-gray-100">Rate this Course</h1>
            <Rating initialRating={0}/>
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
                  {playerData.chapter} . {playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button className="text-blue-500">
                  {false ? "Completed" : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            <img src={courseData ? courseData.courseThumbnail : ""} alt="" />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;

import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import uniqid from "uniqid";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import axios from "axios";
import Loading from "../../components/student/Loading";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopUp(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLectures = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopUp(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!image) {
        toast.error("Thumbnail not selected", {
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

      setLoading(true); // Set loading to true when submission starts

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };
      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
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
    } finally {
      setLoading(false); // Set loading to false after submission completes
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="h-screen bg-slate-600 overflow-scroll flex flex-col items-start justify-between md:pb-0 md:p-8 p-4 pt-8 pb-0">
      {loading ? (
        <Loading />
      ) : (
        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col gap-4 max-w-md w-full text-gray-100"
        >
          <div className="flex flex-col  gap-1">
            <p className=" py-3  ">Course Title</p>
            <input
              type="text"
              placeholder="Type here"
              onChange={(e) => setCourseTitle(e.target.value)}
              value={courseTitle}
              className="outline-none bg-slate-800 md:py-2.5 py-2 px-4 rounded border border-white text-gray-200 placeholder:text-gray-400"
              required
            />
          </div>
          <div className="flex flex-col gap-1 bg-gray-300">
            <p className="bg-slate-600 py-3">Course Description</p>
            <div
              ref={editorRef}
              className="border text-gray-200 bg-slate-800"
            ></div>
          </div>

          <div className="flex items-center justify-between flex-wrap">
            <div className="flex flex-col gap-1">
              <p className="py-2">Course Price</p>
              <input
                type="number"
                placeholder="0"
                onChange={(e) => setCoursePrice(e.target.value)}
                className="outline-none bg-slate-800 md:py-2.5 py-2 px-4 w-28 rounded border border-white"
                required
              />
            </div>

            <div className="flex md:flex-row flex-col items-center gap-3">
              <p>Course Thumbnail</p>
              <label
                htmlFor="thumbnailImage"
                className="flex items-center  gap-3"
              >
                <img
                  src={assets.file_upload_icon}
                  alt=""
                  className="p-3 bg-blue-600 rounded"
                />
                <input
                  type="file"
                  name=""
                  id="thumbnailImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/"
                  hidden
                />

                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Course Thumbnail"
                    className="max-h-10"
                  />
                ) : (
                  <p className="text-gray-400">No image selected</p>
                )}
              </label>
            </div>
          </div>
          <div className="felx flex-col gap-1">
            <p className="py-2">Discount %</p>
            <input
              type="number"
              placeholder="0"
              className="border outline-none md:py-2.5 py-2 w-28 rounded border-white bg-slate-800 px-4"
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              min={0}
              required
            />
          </div>
          {/* Adding chapters and lectures */}
          <div>
            {chapters.map((chapter, chapIdx) => (
              <div
                key={chapIdx}
                className="bg-slate-800 rounded-lg border mb-4"
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center">
                    <img
                      onClick={() => handleChapter("toggle", chapter.chapterId)}
                      src={assets.dropdown_icon}
                      width={14}
                      alt=""
                      className={`mr-2 cursor-pointer transition-all ${
                        chapter.collapsed && "-rotate-90"
                      }`}
                    />
                    <span className="font-semibold">
                      {chapIdx + 1} {chapter.chapterTitle}
                    </span>
                  </div>
                  <span className="text-gray-200">
                    {chapter.chapterContent.length} Lectures
                  </span>
                  <img
                    onClick={() => handleChapter("remove", chapter.chapterId)}
                    src={assets.cross_icon}
                    className="cursor-pointer"
                    alt=""
                  />
                </div>
                {!chapter.collapsed && (
                  <div className="p-4">
                    {chapter.chapterContent.map((lecture, lecIdx) => (
                      <div
                        className="flex justify-between items-center mb-2"
                        key={lecIdx}
                      >
                        <span>
                          {lecIdx + 1} {lecture.lectureTitle} -{" "}
                          {lecture.lectureDuration} mins -
                          <a
                            href={lecture.lectureUrl}
                            target="_blank"
                            className="text-blue-600"
                          >
                            Link
                          </a>
                          <a href="">
                            - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                          </a>
                        </span>
                        <img
                          onClick={() =>
                            handleLecture("remove", chapter.chapterId, lecIdx)
                          }
                          src={assets.cross_icon}
                          className="cursor-pointer"
                          alt=""
                        />
                      </div>
                    ))}
                    <div
                      onClick={() => handleLecture("add", chapter.chapterId)}
                      className="inline-flex bg-slate-600 p-2 rounded cursor-pointer mt-2"
                    >
                      + Add Lecture
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div
              onClick={() => handleChapter("add")}
              className="flex justify-center items-center bg-blue-600 p-2 rounded-lg cursor-pointer"
            >
              + Add Chapter
            </div>

            {showPopUp && (
              <div
                className="fixed inset-0 items-center flex justify-center"
                style={{ backgroundColor: "rgba(100, 120, 130, 0.7)" }}
              >
                <div className="max-w-80 text-gray-50 rounded relative w-full bg-slate-800 p-4">
                  <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
                  <div className="mb-2">
                    <p>Lecture Title</p>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded py-1 px-2"
                      value={lectureDetails.lectureTitle}
                      onChange={(e) =>
                        setLectureDetails({
                          ...lectureDetails,
                          lectureTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <p>Duration (minutes)</p>
                    <input
                      type="number"
                      className="mt-1 block w-full border rounded py-1 px-2"
                      value={lectureDetails.lectureDuration}
                      onChange={(e) =>
                        setLectureDetails({
                          ...lectureDetails,
                          lectureDuration: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <p>Lecture Url</p>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded py-1 px-2"
                      value={lectureDetails.lectureUrl}
                      onChange={(e) =>
                        setLectureDetails({
                          ...lectureDetails,
                          lectureUrl: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="my-2 flex gap-2">
                    <p>Is Preview Free</p>
                    <input
                      type="checkbox"
                      className="mt-1 scale-125"
                      checked={lectureDetails.isPreviewFree}
                      onChange={(e) =>
                        setLectureDetails({
                          ...lectureDetails,
                          isPreviewFree: e.target.checked,
                        })
                      }
                    />
                  </div>

                  <button
                    onClick={addLectures}
                    className="w-full bg-blue-400 text-white px-4 py-2 rounded"
                    type="button"
                  >
                    Add
                  </button>

                  <img
                    src={assets.cross_icon}
                    onClick={() => setShowPopUp(false)}
                    className="cursor-pointer top-4 right-4 absolute w-4"
                    alt=""
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white text-lg font-medium w-max py-2.5 px-8 rounded-lg my-4"
          >
            ADD
          </button>
        </form>
      )}
    </div>
  );
};

export default AddCourse;

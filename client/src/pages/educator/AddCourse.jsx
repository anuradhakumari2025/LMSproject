import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill"; // Importing Quill editor for rich text editing
import uniqid from "uniqid"; // Importing uniqid to generate unique ids for chapters and lectures
import { assets } from "../../assets/assets"; // Importing assets (icons, images)
import { AppContext } from "../../context/AppContext"; // Importing AppContext for backend URL and token
import { toast } from "react-toastify"; // Importing toast for showing notifications
import { Bounce } from "react-toastify"; // Importing Bounce transition for notifications
import axios from "axios"; // Importing axios for HTTP requests
import Loading from "../../components/student/Loading"; // Importing a Loading component for displaying loading state

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext); // Accessing context for backend URL and token function

  const quillRef = useRef(null); // Reference to Quill editor
  const editorRef = useRef(null); // Reference to the HTML div element for the Quill editor
  const [courseTitle, setCourseTitle] = useState(""); // State for course title
  const [coursePrice, setCoursePrice] = useState(0); // State for course price
  const [discount, setDiscount] = useState(0); // State for discount percentage
  const [image, setImage] = useState(null); // State for course image (thumbnail)
  const [chapters, setChapters] = useState([]); // State to hold course chapters and their content
  const [showPopUp, setShowPopUp] = useState(false); // State for controlling visibility of the pop-up for adding lectures
  const [currentChapterId, setCurrentChapterId] = useState(null); // State for holding the current chapter id when adding a lecture
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  }); // State for holding lecture details like title, duration, URL, and preview status
  const [loading, setLoading] = useState(false); // Loading state to manage loading indicator

  // Function to handle chapter actions (add, remove, toggle collapse)
  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:"); // Prompt to enter chapter title
      if (title) {
        const newChapter = {
          chapterId: uniqid(), // Generate unique chapter ID
          chapterTitle: title, // Set chapter title
          chapterContent: [], // Initialize empty content for chapter
          collapsed: false, // Set initial state for collapse
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1, // Set chapter order based on existing chapters
        };
        setChapters([...chapters, newChapter]); // Add new chapter to the chapters state
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId) // Remove chapter by ID
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed } // Toggle collapse state
            : chapter
        )
      );
    }
  };

  // Function to handle lecture actions (add, remove)
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId); // Set the current chapter ID when adding a lecture
      setShowPopUp(true); // Show the pop-up to add lecture details
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1); // Remove lecture from chapter by index
          }
          return chapter;
        })
      );
    }
  };

  // Function to add a new lecture to the selected chapter
  const addLectures = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1, // Set lecture order based on existing lectures in the chapter
            lectureId: uniqid(), // Generate unique lecture ID
          };
          chapter.chapterContent.push(newLecture); // Add new lecture to the chapter
        }
        return chapter;
      })
    );
    setShowPopUp(false); // Hide the pop-up after adding lecture
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    }); // Reset lecture details state
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    try {
      e.preventDefault(); // Prevent default form submission behavior
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
        }); // Show error if thumbnail image is not selected
      }

      setLoading(true); // Set loading state to true during form submission

      // Create the course data to send to the backend
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML, // Get course description from the Quill editor
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };
      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData)); // Append course data to form data
      formData.append("image", image); // Append the image file to form data
      const token = await getToken(); // Get the authentication token from context
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`, // Send POST request to add course
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the request headers
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
        }); // Show success notification
        setCourseTitle(""); // Reset form fields after successful submission
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = ""; // Reset Quill editor content
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
        }); // Show error notification if something goes wrong
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
      }); // Show error notification for unexpected errors
    } finally {
      setLoading(false); // Set loading state to false after submission completes
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow", // Initialize Quill editor with snow theme
      });
    }
  }, []);

  return (
    <div className="h-screen bg-slate-600 overflow-scroll flex flex-col items-start justify-between md:pb-0 md:p-8 p-4 pt-8 pb-0">
      {loading ? (
        <Loading /> // Show loading spinner if loading is true
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
          <div className="flex flex-col gap-1 bg-gray-300 p-4 mt-4 rounded">
            <p className="py-2">Upload Thumbnail</p>
            <div className="py-3">
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <p className=" py-3">Course Price</p>
            <input
              type="number"
              placeholder="Enter price"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              className="outline-none bg-slate-800 md:py-2.5 py-2 px-4 rounded border border-white text-gray-200 placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <p className=" py-3">Discount</p>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount"
              className="outline-none bg-slate-800 md:py-2.5 py-2 px-4 rounded border border-white text-gray-200 placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <p className=" py-3">Course Description</p>
            <div
              ref={editorRef}
              style={{
                minHeight: "200px",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "8px",
              }}
            ></div>
          </div>
          <div className="flex flex-col gap-2 mt-6">
            <p className="text-xl font-semibold text-gray-400">Course Chapters</p>
            <div className="flex flex-col gap-2">
              {chapters.map((chapter, index) => (
                <div key={chapter.chapterId}>
                  <div className="flex justify-between items-center">
                    <span className="text-xl">{chapter.chapterTitle}</span>
                    <div>
                      <button
                        onClick={() => handleChapter("toggle", chapter.chapterId)}
                        className="text-sm"
                      >
                        {chapter.collapsed ? "Expand" : "Collapse"}
                      </button>
                      <button
                        onClick={() => handleChapter("remove", chapter.chapterId)}
                        className="text-sm text-red-500 ml-2"
                      >
                        Remove Chapter
                      </button>
                    </div>
                  </div>
                  {!chapter.collapsed && (
                    <div className="flex flex-col gap-2 ml-4 mt-2">
                      {chapter.chapterContent.map((lecture, i) => (
                        <div key={lecture.lectureId} className="flex justify-between items-center">
                          <span>{lecture.lectureTitle}</span>
                          <button
                            onClick={() => handleLecture("remove", chapter.chapterId, i)}
                            className="text-sm text-red-500"
                          >
                            Remove Lecture
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleLecture("add", chapter.chapterId)}
                        className="text-sm text-blue-500"
                      >
                        Add Lecture
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-900 text-white text-lg font-medium w-full p-3 rounded-md"
          >
            Add Course
          </button>
        </form>
      )}
    </div>
  );
};

export default AddCourse;

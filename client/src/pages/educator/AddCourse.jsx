import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import uniqid from "uniqid";

const AddCourse = () => {
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

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="h-screen bg-slate-600 overflow-scroll flex flex-col items-start justify-between md:pb-0 md:p-8 p-4 pt-8 pb-0">
      <form
        action=""
        className="flex flex-col gap-4 max-w-md w-full text-gray-100"
      >
        <div className="flex flex-col  gap-1">
          <p className="text-xl text-white pb-4  ">Course Title</p>
          <input
            type="text"
            placeholder="Type here"
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            className="outline-none md:py-2.5 py-2 px-4 rounded border border-white text-gray-200 placeholder:text-gray-400"
            required
          />
        </div>
        <div className="flex flex-col gap-1 bg-gray-300 ">
          <p className="bg-slate-600">Course Description</p>
          <div ref={editorRef} className="border"></div>
        </div>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => setCoursePrice(e.target.value)}
              className="outline-none md:py-2.5 py-2 px-4 w-28 rounded border border-white"
              required
            />
          </div>

          <div>
            <p>Course Thumbnail</p>
            <label htmlFor=""></label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;

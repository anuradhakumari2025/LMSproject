import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { Bounce } from "react-toastify";
import { toast } from "react-toastify";
import axios from "axios";

const MyCourses = () => {
  const { currency, allCourses,backendUrl,isEducator,getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const {data} = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setCourses(data.courses);
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
    if(isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);
  return courses ? (
    <div className="px-4 bg-slate-600 pt-8 pb-0 min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-10">
      <div className="w-full px-4 pb-4">
        <h2 className="pb-4 text-2xl font-medium text-white">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-slate-800 border border-white">
          <table className="md:table-auto table-fixed w-full overflow-hidden ">
            <thead className="text-gray-100 border-b border-gray-50 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">
                  All Courses
                </th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">
                  Published On
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-400">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img src={course.courseThumbnail} alt="" className="w-16" />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3">
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3 md:px-8">
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3 md:px-5">
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
    <Loading />
  );
};

export default MyCourses;

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };
  useEffect(() => {
    fetchEducatorCourses();
  }, []);
  return courses ? (
    <div className="px-4 bg-slate-600 pt-8 pb-0 min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-10">
      <div className="w-full px-4 pb-4">
        <h2 className="pb-4 text-xl font-medium text-white">My Courses</h2>
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
                  <td className="px-4 py-3">
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3 ">
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3">{new Date(course.createdAt).toLocaleDateString()}</td>
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

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const fetchEducatorCourses = async () => {
    setCourse(allCourses);
  };
  useEffect(() => {
    fetchEducatorCourses();
  }, []);
  return course ? <div>
    <h2 className="pb-4 text-lg font-medium text-white">My Courses</h2>
  </div> : <Loading/>;
};

export default MyCourses;

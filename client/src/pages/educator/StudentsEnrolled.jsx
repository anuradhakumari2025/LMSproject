import React, { useContext, useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const {backendUrl,getToken,isEducator} = useContext(AppContext)
  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()
      const {data} = await axios.get(backendUrl +'/api/educator/enrolled-students',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if(data.success){
        setEnrolledStudents(data.enrolledStudents.reverse())
      }else{
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
      console.log(error)
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
  };
  useEffect(() => {
    if(isEducator){
      fetchEnrolledStudents()
    }
  }, [isEducator]);
  return enrolledStudents ? (

    <>
    <h1 className="px-10 text-white pt-8 text-xl font-semibold bg-slate-600">Students Enrolled</h1>
    <div className="bg-slate-600 min-h-screen p-5 flex flex-col items-start justify-between md:p-8 md:pb-0 pb-0 pt-8">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-slate-800 border border-gray-200">
        <table className="table-fixed md:table-auto w-full overflow-hidden">
          <thead className="text-gray-100 border-b border-gray-100 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                #
              </th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {enrolledStudents.map((item, index) => (
              
             <tr className="border-b border-white text-gray-300" key={index}>
              <td className="hidden text-center sm:table-cell">{index+1}</td>
               <td className="px-4 py-3 flex items-center space-x-4" >
                <img
                  src={item.student.imageUrl}
                  alt=""
                  className="w-9 h-9 rounded-full"
                />
                <span>{item.student.name}</span>
              </td>
              <td>{item.courseTitle}</td>
              <td>{new Date(item.purchaseDate).toLocaleDateString()}</td>
             </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;

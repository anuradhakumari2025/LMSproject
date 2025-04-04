import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { Bounce } from "react-toastify";

const Dashboard = () => {
  const { currency,backendUrl,getToken,isEducator } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData =async () => {
    try {
      const token =await getToken();
      // console.log("token",token)
      const {data} = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data)
      if(data.success) {
        setDashboardData(data.dashBoardData);
      }
      else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
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
      });
    }
  };
  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);
  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 pt-8 pb-0 bg-slate-600">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-md text-white shadow-gray-400 border-2 border-blue-500 p-4 w-60 rounded-md bg-slate-800">
            <img src={assets.patients_icon} alt="" />
            <div>
              <p className="text-2xl  font-medium text-gray-100">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-base text-gray-300">Total Enrollments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-md text-white shadow-gray-400 border-2 border-blue-500 p-4 w-60 rounded-md bg-slate-800">
            <img src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-2xl  font-medium text-gray-100">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-300">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-md text-white shadow-gray-400 border-2 border-blue-500 p-4 w-60 rounded-md bg-slate-800">
            <img src={assets.earning_icon} alt="" />
            <div>
              <p className="text-2xl  font-medium text-gray-100">
                {currency} {dashboardData.totalEarnings}
              </p>
              <p className="text-base text-gray-300">Total Earnings</p>
            </div>
          </div>
        </div>

        <div className="my-6">
          <h2 className="pb-6 text-xl font-medium text-white">
            Latest Enrolments
          </h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-slate-800 border border-gray-200">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-100 border-b border-gray-100 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-300">
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl}
                        alt="Profile"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;

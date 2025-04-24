import React, { useContext, useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets"; // Assuming dummy data, not used in the code
import Loading from "../../components/student/Loading"; // Importing Loading component to show during data fetch
import { AppContext } from "../../context/AppContext"; // Importing context to access global state
import axios from "axios"; // Importing axios for making HTTP requests
import { toast } from "react-toastify"; // Importing toast for showing notifications
import { Bounce } from "react-toastify"; // Importing Bounce transition for toast notifications

const StudentsEnrolled = () => {
  // State to store the enrolled students data
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  
  // Extracting necessary values from the AppContext
  const { backendUrl, getToken, isEducator } = useContext(AppContext);

  // Function to fetch the list of enrolled students
  const fetchEnrolledStudents = async () => {
    try {
      // Getting the token for authorization
      const token = await getToken();
      
      // Making a GET request to fetch enrolled students
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {
        headers: {
          Authorization: `Bearer ${token}`, // Adding token to headers for authentication
        },
      });

      if (data.success) {
        // If the response is successful, update the state with the fetched students
        setEnrolledStudents(data.enrolledStudents.reverse()); // Reversing the array to show the latest students first
      } else {
        // If the response is unsuccessful, show an error toast
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce, // Using Bounce transition for toast
        });
      }
    } catch (error) {
      console.log(error); // Log the error to the console
      // Show a toast with a generic error message in case of an exception
      toast.error("Thumbnail not selected", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce, // Using Bounce transition for toast
      });
    }
  };

  // useEffect hook to fetch enrolled students when the component mounts or when `isEducator` changes
  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents(); // Fetch students if the user is an educator
    }
  }, [isEducator]); // Dependency array ensures this runs whenever `isEducator` changes

  return enrolledStudents ? (
    <>
      {/* Displaying header for the section */}
      <h1 className="px-10 text-white pt-8 text-xl font-semibold bg-slate-600">Students Enrolled</h1>

      <div className="bg-slate-600 min-h-screen p-5 flex flex-col items-start justify-between md:p-8 md:pb-0 pb-0 pt-8">
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-slate-800 border border-gray-200">
          {/* Table to display the list of enrolled students */}
          <table className="table-fixed md:table-auto w-full overflow-hidden">
            <thead className="text-gray-100 border-b border-gray-100 text-sm text-left">
              <tr>
                {/* Table headers */}
                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Course Title</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Mapping through the enrolled students and displaying each student's details */}
              {enrolledStudents.map((item, index) => (
                <tr className="border-b border-white text-gray-300" key={index}>
                  <td className="hidden text-center sm:table-cell">{index + 1}</td>
                  <td className="px-4 py-3 flex items-center space-x-4">
                    {/* Displaying student profile picture and name */}
                    <img
                      src={item.student.imageUrl}
                      alt=""
                      className="w-9 h-9 rounded-full"
                    />
                    <span>{item.student.name}</span>
                  </td>
                  <td>{item.courseTitle}</td>
                  <td>{new Date(item.purchaseDate).toLocaleDateString()}</td> {/* Displaying purchase date */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
    // If enrolled students data is not available yet, show the loading component
    <Loading />
  );
};

export default StudentsEnrolled; // Exporting the component for use elsewhere

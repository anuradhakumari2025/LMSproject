import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/student/Home"; // Home page for students
import CoursesList from "./pages/student/CoursesList"; // List of all available courses
import CourseDetails from "./pages/student/CourseDetails"; // Detailed view of a single course
import MyEnrollments from "./pages/student/MyEnrollments"; // View of courses that the student is enrolled in
import Player from "./pages/student/Player"; // Video player for course lectures
import Loading from "./components/student/Loading"; // Loading component (e.g., for async operations)
import Educator from "./pages/educator/Educator"; // Educator main page
import Dashboard from "./pages/educator/Dashboard"; // Educator dashboard
import AddCourse from "./pages/educator/AddCourse"; // Page for educators to add a new course
import MyCourses from "./pages/educator/MyCourses"; // Page showing courses created by the educator
import StudentsEnrolled from "./pages/educator/StudentsEnrolled"; // Page showing students enrolled in a course
import Navbar from "./components/student/Navbar"; // Navigation bar for the student
import 'quill/dist/quill.snow.css' // Importing the Quill editor style
import { ToastContainer} from 'react-toastify'; // Toast notifications container

function App() {
  const isEducatorRoute = useMatch("/educator/*"); // Checking if the current route is for the educator

  return (
    <div className="bg-slate-900 min-h-screen text-default">
      <ToastContainer /> {/* Container for toast notifications */}
      {!isEducatorRoute && <Navbar />} {/* Render Navbar only for student routes */}
      
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/course-list" element={<CoursesList />} /> {/* Courses list page */}
        <Route path="/course-list/:input" element={<CoursesList />} /> {/* Filtered courses list page */}
        <Route path="/course/:id" element={<CourseDetails />} /> {/* Course details page */}
        <Route path="/my-enrollments" element={<MyEnrollments />} /> {/* My enrollments page */}
        <Route path="/player/:courseId" element={<Player />} /> {/* Player for video lectures */}
        <Route path="/loading/:path" element={<Loading />} /> {/* Loading page for async operations */}

        {/* Educator Routes */}
        <Route path="/educator" element={<Educator />}>
          <Route path="dashboard" element={<Dashboard />} /> {/* Educator dashboard */}
          <Route path="add-course" element={<AddCourse />} /> {/* Add new course page */}
          <Route path="my-courses" element={<MyCourses />} /> {/* List of courses created by educator */}
          <Route path="student-enrolled" element={<StudentsEnrolled />} /> {/* Students enrolled in the educator's courses */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;

/** @format */

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // 'teacher' or 'student'

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const goToHome = () => {
    if (role === "teacher") {
      navigate("/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold cursor-pointer" onClick={goToHome}>
        EduPlatform
      </h1>

      <div className="flex items-center gap-4">
        {/* ✅ Teacher Nav Items */}
        {role === "teacher" && (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition">
              Dashboard
            </button>
            <button
              onClick={() => navigate("/class/create")}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition">
              Create Class
            </button>
            <button
              onClick={() => navigate("/assignment/create")}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition">
              New Assignment
            </button>
            <button
              onClick={() => navigate("/quiz/create")}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition">
              New Quiz
            </button>
            <button
              onClick={() => navigate("/class/open")}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition">
              Open Class
            </button>
            <button
              onClick={() => navigate("/teacher/records")}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition">
              Records
            </button>
          </>
        )}

        {/* ✅ Student Nav Items */}
        {role === "student" && (
          <>
            <button
              onClick={() => navigate("/student/classes")}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition">
              All Classes
            </button>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition">
              My Classes
            </button>
          </>
        )}

        {/* Logout is common */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </nav>
  );
}

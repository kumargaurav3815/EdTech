/** @format */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const goToHome = () => {
    if (role === "teacher") navigate("/dashboard");
    else navigate("/student/dashboard");
  };

  const teacherLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Create Class", path: "/class/create" },
    { label: "New Assignment", path: "/assignment/create" },
    { label: "New Quiz", path: "/quiz/create" },
    { label: "Open Class", path: "/class/open" },
    { label: "Records", path: "/teacher/records" },
  ];

  const studentLinks = [
    { label: "All Classes", path: "/student/classes" },
    { label: "My Classes", path: "/student/dashboard" },
  ];

  const links = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-lg backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={goToHome}
          className="text-2xl font-extrabold tracking-wide cursor-pointer drop-shadow-md hover:text-yellow-300 transition">
          Skill<span className="text-yellow-300">Edge</span>
        </h1>

        {/* Hamburger Menu (Mobile) */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:scale-110 transition">
            {menuOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiOutlineMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-4">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="text-sm font-medium bg-white/80 text-blue-700 px-4 py-2 rounded-xl hover:bg-white hover:scale-105 hover:shadow-lg transition-all hover:cursor-pointer">
              {link.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm font-medium bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 hover:scale-105 shadow transition-all">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-2 bg-blue-700/90 backdrop-blur-lg shadow-md">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                navigate(link.path);
                setMenuOpen(false);
              }}
              className="w-full text-left bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 hover:scale-[1.01] transition-all ">
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-[1.01] transition-all">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

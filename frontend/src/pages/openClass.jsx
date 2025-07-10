/** @format */

// src/pages/OpenClass.jsx
import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function OpenClass() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/class/my-classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setClasses(res.data))
      .catch(() => alert("Failed to load classes"));
  }, []);

  const handleOpen = (e) => {
    e.preventDefault();
    if (!selectedClass) return alert("Please select a class to open.");
    navigate(`/class/${selectedClass}`);
  };

  return (
    <>
      <Navbar />
      <Motion.div
        className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto flex items-center justify-center bg-gradient-to-br from-sky-100 to-pink-100 px-4 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <Motion.form
          onSubmit={handleOpen}
          className="w-full max-w-md bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}>
          <h2 className="text-3xl font-bold text-center text-green-700">
            Open Class
          </h2>

          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">-- Choose Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl shadow-md font-semibold transition-all duration-300">
            🚀 Open Class
          </button>
        </Motion.form>
      </Motion.div>
    </>
  );
}

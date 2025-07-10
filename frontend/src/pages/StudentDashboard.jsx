/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion as Motion } from "framer-motion";
import { FaChalkboardTeacher, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/class/mine", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setClasses(res.data))
      .catch(() => toast.error("Failed to load your classes. Try refreshing."));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <Motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-blue-800 mb-10">
          🎓 Your Enrolled Classes
        </Motion.h2>

        {classes.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 bg-white/70 backdrop-blur-sm border border-gray-200 p-8 rounded-xl shadow max-w-xl mx-auto">
            <p className="text-lg">You haven’t enrolled in any class yet.</p>
            <button
              onClick={() => navigate("/student/classes")}
              className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition">
              <FaPlus /> Browse Classes
            </button>
          </Motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, index) => (
              <Motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/student/class/${cls._id}`)}
                className="cursor-pointer bg-white/80 backdrop-blur-md border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all">
                <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                  <FaChalkboardTeacher className="text-lg" />
                  {cls.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Click to view class details
                </p>
              </Motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

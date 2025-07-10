/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineDescription, MdAccessTime } from "react-icons/md";
import { motion as Motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function StudentAllClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/class/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setClasses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to fetch classes");
        setLoading(false);
      });
  }, []);

  const handleEnroll = async (classId, teacherId) => {
    try {
      await axios.post(
        "/class/enroll",
        { classId, teacherId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("🎉 Enrolled successfully!");
      setClasses((prev) => prev.filter((cls) => cls._id !== classId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />

      {/* Animated Background */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
        <div className="p-6 max-w-7xl mx-auto">
          <Motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl font-extrabold text-center text-blue-900 drop-shadow mb-10">
            🎓 Explore & Enroll in Live Classes
          </Motion.h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : classes.length === 0 ? (
            <p className="text-center text-gray-600">
              No classes available to enroll.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((cls, index) => (
                <Motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    {cls.title}
                  </h3>

                  <p className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <FaChalkboardTeacher className="text-base" />
                    <strong>Teacher:</strong> {cls.teacherName || "Unknown"}
                  </p>

                  {cls.description && (
                    <p className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                      <MdOutlineDescription className="text-lg mt-0.5" />
                      <span>
                        <strong>Description:</strong> {cls.description}
                      </span>
                    </p>
                  )}

                  {cls.schedule && (
                    <p className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <MdAccessTime className="text-lg" />
                      <span>
                        <strong>Schedule:</strong>{" "}
                        {new Date(cls.schedule).toLocaleString()}
                      </span>
                    </p>
                  )}

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleEnroll(cls._id, cls.teacherId)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all hover:cursor-pointer">
                      Enroll
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/student/class/${cls._id}?teacher=${cls.teacherId}`
                        )
                      }
                      className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all hover:cursor-pointer">
                      View Details
                    </button>
                  </div>
                </Motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

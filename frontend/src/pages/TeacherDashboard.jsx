/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion as Motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import CalendarView from "../components/CalendarView";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/class/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert(err.response?.data?.message || "Failed to load classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async () => {
    if (!selectedClassId) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/class/${selectedClassId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses((prev) => prev.filter((cls) => cls._id !== selectedClassId));
      toast.success("Class deleted successfully 🎉");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete class");
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <Motion.div
        className="min-h-screen bg-gradient-to-br from-sky-100 to-pink-100 px-4 sm:px-10 py-10 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <Motion.div
            className="flex flex-col items-center justify-center text-center mt-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>
            <Motion.h1
              className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text flex flex-col sm:flex-row items-center justify-center gap-2 leading-snug sm:leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}>
              <span className="text-2xl sm:text-3xl">✨</span>
              <span>My Teaching Dashboard</span>
            </Motion.h1>
            <p className="mt-2 text-lg text-gray-800">
              Create, manage, and track your live classes effortlessly.
            </p>
            <div className="w-24 h-1 mt-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full" />
          </Motion.div>

          {/* Class Cards */}
          {classes.length === 0 ? (
            <div className="text-center text-xl text-gray-500 py-20">
              🚫 No classes found.
            </div>
          ) : (
            <Motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}>
              {classes.map((cls, index) => (
                <Motion.div
                  key={cls._id}
                  className="relative p-6 rounded-3xl bg-white/60 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl hover:border-blue-500/70 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    📘 {cls.title}
                  </h2>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {cls.description}
                  </p>

                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                      🎥 Live Mode
                    </span>
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                      ⏱ Duration: 60 min
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/class/${cls._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-medium shadow transition hover:cursor-pointer">
                      🔍 Open Class
                    </button>
                    <button
                      onClick={() => navigate(`/class/${cls._id}/assignments`)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl font-medium shadow transition hover:cursor-pointer">
                      📝 Assignments
                    </button>
                    <button
                      onClick={() => navigate(`/class/${cls._id}/quizzes`)}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-medium shadow transition hover:cursor-pointer">
                      ❓ Quizzes
                    </button>
                    <button
                      onClick={() => navigate(`/class/${cls._id}/edit`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl font-medium shadow transition hover:cursor-pointer">
                      🕓 Reschedule
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClassId(cls._id);
                        setShowModal(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium shadow transition hover:cursor-pointer">
                      🗑️ Delete
                    </button>
                    <Dialog
                      open={showModal}
                      onClose={() => setShowModal(false)}
                      className="fixed z-50 inset-0 overflow-y-auto">
                      <div className="flex items-center justify-center min-h-screen px-4">
                        <Dialog.Panel className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-lg text-center space-y-4">
                          <Dialog.Title className="text-lg font-bold text-red-600">
                            Confirm Delete
                          </Dialog.Title>
                          <p className="text-sm text-gray-600">
                            Are you sure you want to delete this class? This
                            action cannot be undone.
                          </p>
                          <div className="flex justify-center gap-4 pt-4">
                            <button
                              className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 text-sm"
                              onClick={() => setShowModal(false)}
                              disabled={isDeleting}>
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm"
                              onClick={handleDelete}
                              disabled={isDeleting}>
                              {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                          </div>
                        </Dialog.Panel>
                      </div>
                    </Dialog>
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          )}
        </div>
      </Motion.div>
    </>
  );
}

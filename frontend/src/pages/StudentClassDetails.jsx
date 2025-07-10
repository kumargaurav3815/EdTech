/** @format */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { MdAssignment, MdQuiz, MdSchedule } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function StudentClassDetails() {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!id || id === "undefined") {
        alert("Invalid class link.");
        navigate("/student/dashboard");
        return;
      }

      try {
        const res = await axios.get(`/class/${id}/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setClassData(res.data.class);
        setAssignments(res.data.assignments || []);
        setQuizzes(res.data.quizzes || []);
      } catch (err) {
        const status = err.response?.status;
        if (status === 403) alert("Access denied. You're not enrolled.");
        else if (status === 404) alert("Class not found.");
        else alert("Something went wrong.");
        navigate("/student/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id, navigate]);

  const toggleAssignment = (assignmentId) => {
    setExpandedAssignment((prev) =>
      prev === assignmentId ? null : assignmentId
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {loading ? (
          <p className="text-gray-600 text-center text-lg">
            Loading class details...
          </p>
        ) : !classData ? (
          <p className="text-red-600 text-center text-lg">Class not found.</p>
        ) : (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl border border-gray-200 p-8 rounded-xl shadow-2xl max-w-5xl mx-auto">
            {/* Class Info Header */}
            <div className="flex justify-between flex-wrap gap-4 items-start">
              <div>
                <h2 className="text-3xl font-extrabold text-blue-800 mb-1">
                  {classData.title}
                </h2>
                <p className="text-md text-gray-700 mb-1">
                  <strong>Topic:</strong> {classData.description}
                </p>
                <p className="text-md text-gray-700 flex items-center gap-2">
                  <FaChalkboardTeacher />
                  <strong>By:</strong> {classData.teacherId?.name || "Unknown"}
                </p>
                {classData.schedule && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <MdSchedule className="text-xl" />
                    <strong>Schedule:</strong>{" "}
                    {new Date(classData.schedule).toLocaleString()}
                  </p>
                )}
              </div>

              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/class/${id}/live`)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-5 py-2 rounded-lg shadow hover:shadow-lg hover:cursor-pointer">
                🚀 Join Live Class
              </Motion.button>
            </div>

            {/* Assignments Section */}
            {assignments.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8">
                <h3 className="text-xl font-bold mb-3 text-purple-700 flex items-center gap-2">
                  <MdAssignment className="text-2xl" />
                  Assignments
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {assignments.map((a) => (
                    <div
                      key={a._id}
                      onClick={() => toggleAssignment(a._id)}
                      className="cursor-pointer bg-purple-50 border border-purple-200 p-4 rounded-lg shadow hover:shadow-md transition-all relative">
                      <h4 className="text-md font-semibold text-purple-900">
                        {a.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {a.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        📅 Due: {new Date(a.dueDate).toLocaleDateString()}
                      </p>

                      <AnimatePresence>
                        {expandedAssignment === a._id && (
                          <Motion.div
                            key="details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 text-sm text-gray-700 overflow-hidden border-t border-purple-300 pt-2">
                            {/* PDF View Button */}
                            {a.upload && (
                              <div className="mb-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(a.upload, "_blank");
                                  }}
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1 rounded-lg text-sm transition hover:cursor-pointer">
                                  📄 View Assignment PDF
                                </button>
                              </div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/assignment/${a._id}/submit`);
                              }}
                              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-lg text-sm shadow hover:cursor-pointer">
                              ✍️ Submit Assignment
                            </button>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </Motion.div>
            )}

            {/* Quizzes Section */}
            {quizzes.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8">
                <h3 className="text-xl font-bold mb-3 text-green-700 flex items-center gap-2">
                  <MdQuiz className="text-2xl" />
                  Quizzes
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quizzes.map((q) => (
                    <div
                      key={q._id}
                      className="bg-green-50 border border-green-200 p-4 rounded-lg shadow hover:shadow-md transition-all">
                      <h4 className="text-md font-semibold text-green-900">
                        {q.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        🧠 {q.questions?.length || 0} Questions
                      </p>
                    </div>
                  ))}
                </div>
              </Motion.div>
            )}
          </Motion.div>
        )}
      </div>
    </>
  );
}

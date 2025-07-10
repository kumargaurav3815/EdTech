/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function TeacherRecords() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/records/teacher", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setStudents(res.data))
      .catch((err) => {
        console.error("Fetch students error:", err);
        alert(err.response?.data?.message || "Failed to fetch students");
      });
  }, []);

  return (
    <>
      <Navbar />
      <Motion.div
        className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-gradient-to-br from-sky-100 to-pink-100 px-4 py-10 flex items-start justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <Motion.div
          className="w-full max-w-3xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl p-6 space-y-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}>
          <h2 className="text-3xl font-bold text-blue-700 text-center">
            👨‍🎓 Enrolled Students
          </h2>

          {students.length === 0 ? (
            <p className="text-gray-600 text-center">No students found.</p>
          ) : (
            <ul className="space-y-4">
              {students.map((s, index) => (
                <Motion.li
                  key={s._id}
                  onClick={() => navigate(`/teacher/records/${s._id}`)}
                  className="cursor-pointer bg-white border border-gray-300 hover:bg-blue-50 p-4 rounded-xl shadow-md transition-all"
                  whileHover={{ scale: 1.02 }}>
                  <p className="font-semibold text-lg text-blue-900">
                    {index + 1}. {s.name}
                  </p>
                  <p className="text-sm text-gray-600">{s.email}</p>
                </Motion.li>
              ))}
            </ul>
          )}
        </Motion.div>
      </Motion.div>
    </>
  );
}

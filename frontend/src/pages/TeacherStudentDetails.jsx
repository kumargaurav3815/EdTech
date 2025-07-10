/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";
import { motion as Motion } from "framer-motion";

export default function TeacherStudentDetails() {
  const { id } = useParams(); // studentId
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    axios
      .get(`/records/teacher/records/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setStudent(res.data.student);
        setClasses(res.data.enrolledClasses);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Error fetching student details");
      });
  }, [id]);

  if (!student) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-gray-500">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Motion.div
        className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-gradient-to-br from-sky-100 to-pink-100 px-4 py-10 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <Motion.div
          className="w-full max-w-3xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl p-6 space-y-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-700">
              📘 Student: {student.name}
            </h2>
            <p className="text-sm text-gray-700 mt-1">{student.email}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              🎓 Enrolled Classes
            </h3>
            {classes.length === 0 ? (
              <p className="text-gray-600 text-center">
                Not enrolled in any class.
              </p>
            ) : (
              <ul className="space-y-4">
                {classes.map((cls) => (
                  <Motion.li
                    key={cls._id}
                    className="bg-white border border-gray-300 p-4 rounded-xl shadow-md hover:bg-blue-50 transition-all"
                    whileHover={{ scale: 1.02 }}>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {cls.title}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {cls.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Teacher: {cls.teacherId?.name}
                    </p>
                  </Motion.li>
                ))}
              </ul>
            )}
          </div>
        </Motion.div>
      </Motion.div>
    </>
  );
}

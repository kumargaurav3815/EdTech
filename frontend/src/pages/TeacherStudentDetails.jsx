/** @format */

// src/pages/TeacherStudentDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";

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

  if (!student) return <p className="p-6">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Student: {student.name}</h2>
        <p className="text-sm text-gray-600 mb-4">Email: {student.email}</p>

        <h3 className="text-xl font-semibold mb-2">Enrolled Classes:</h3>
        {classes.length === 0 ? (
          <p className="text-gray-500">Not enrolled in any class.</p>
        ) : (
          <ul className="space-y-2">
            {classes.map((cls) => (
              <li key={cls._id} className="border p-4 rounded shadow">
                <h4 className="font-medium">{cls.title}</h4>
                <p className="text-sm text-gray-700">{cls.description}</p>
                <p className="text-xs text-gray-500">
                  By: {cls.teacherId?.name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

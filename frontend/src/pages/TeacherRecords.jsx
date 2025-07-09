/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Enrolled Students</h2>
        {students.length === 0 ? (
          <p className="text-gray-500">No students found.</p>
        ) : (
          <ul className="space-y-3">
            {students.map((s) => (
              <li
                key={s._id}
                onClick={() => navigate(`/teacher/records/${s._id}`)}
                className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition">
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-600">{s.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

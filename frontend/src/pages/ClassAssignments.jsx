/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";

export default function ClassAssignments() {
  const { id } = useParams(); // classId from URL
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Fetch assignments for class
    axios
      .get(`/assignment/class/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setAssignments(res.data))

      .catch((err) => {
        console.error("Fetch assignments error:", err);
        alert(err.response?.data?.message || "Failed to fetch assignments");
      });
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Assignments</h2>

        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments found for this class.</p>
        ) : (
          <ul className="space-y-4">
            {assignments.map((a) => (
              <li
                key={a._id}
                className="border p-4 rounded shadow bg-white hover:shadow-md transition duration-200">
                <h3 className="text-lg font-semibold text-blue-800">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-700 mt-1">{a.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Due Date:{" "}
                  {a.dueDate
                    ? new Date(a.dueDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

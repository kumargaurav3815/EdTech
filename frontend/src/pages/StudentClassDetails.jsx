/** @format */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";

export default function StudentClassDetails() {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
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

  return (
    <>
      <Navbar />
      <div className="p-6">
        {loading ? (
          <p className="text-gray-500">Loading class details...</p>
        ) : !classData ? (
          <p className="text-red-600">Class not found.</p>
        ) : (
          <div className="border p-6 rounded shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-blue-700">
                  {classData.title}
                </h2>
                <p className="text-md text-gray-600 mb-2">
                  <strong>Topic:</strong> {classData.description}
                </p>
                <p className="text-md text-gray-600 mb-2">
                  <strong>By:</strong> {classData.teacherId?.name || "Unknown"}
                </p>
                {classData.schedule && (
                  <p className="text-sm text-gray-500 mb-3">
                    <strong>Schedule:</strong>{" "}
                    {new Date(classData.schedule).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate(`/class/${id}/live`)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
                Join Live Class
              </button>
            </div>

            {/* Assignments Section */}
            {assignments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-700">
                  Assignments
                </h3>
                <ul className="space-y-2">
                  {assignments.map((a) => (
                    <li
                      key={a._id}
                      className="border p-3 rounded bg-gray-50 hover:bg-gray-100">
                      <h4 className="font-medium">{a.title}</h4>
                      <p className="text-sm text-gray-600">{a.description}</p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(a.dueDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quizzes Section */}
            {quizzes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-green-700">
                  Quizzes
                </h3>
                <ul className="space-y-2">
                  {quizzes.map((q) => (
                    <li
                      key={q._id}
                      className="border p-3 rounded bg-gray-50 hover:bg-gray-100">
                      <h4 className="font-medium">{q.title}</h4>
                      <p className="text-sm text-gray-600">
                        {q.questions?.length} Questions
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

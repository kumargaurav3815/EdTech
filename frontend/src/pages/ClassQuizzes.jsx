/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";

export default function ClassQuizzes() {
  const { id } = useParams(); // classId from URL
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios
      .get(`/quiz/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setQuizzes(res.data))
      .catch((err) => {
        console.error("Fetch quizzes error:", err);
        alert(err.response?.data?.message || "Failed to fetch quizzes");
      });
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Quizzes</h2>

        {quizzes.length === 0 ? (
          <p className="text-gray-500">No quizzes found for this class.</p>
        ) : (
          <ul className="space-y-6">
            {quizzes.map((quiz, qi) => (
              <li
                key={quiz._id}
                className="border p-4 rounded shadow bg-white hover:shadow-md transition duration-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-1">
                  {quiz.title || `Quiz ${qi + 1}`}
                </h3>
                {quiz.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {quiz.description}
                  </p>
                )}

                {/* Questions */}
                {quiz.questions && quiz.questions.length > 0 && (
                  <div className="mt-2 space-y-3">
                    {quiz.questions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className="border-l-4 border-gray-300 pl-4">
                        <p className="font-medium text-sm">
                          Q{qIndex + 1}: {q.question}
                        </p>
                        <ul className="list-disc ml-5 mt-1">
                          {q.options.map((opt, i) => (
                            <li
                              key={i}
                              className={`text-sm ${
                                opt === q.correctAnswer
                                  ? "text-green-700 font-semibold"
                                  : ""
                              }`}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-gray-500 mt-1">
                          Correct Answer:{" "}
                          <span className="text-green-600 font-medium">
                            {q.correctAnswer || "N/A"}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";
import { motion as Motion } from "framer-motion";

export default function ClassQuizzes() {
  const { id } = useParams();
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
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-pink-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Motion.h2
            className="text-3xl font-bold text-center text-blue-700 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            🧠 Class Quizzes
          </Motion.h2>

          {quizzes.length === 0 ? (
            <Motion.p
              className="text-center text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}>
              No quizzes found for this class.
            </Motion.p>
          ) : (
            <Motion.ul
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}>
              {quizzes.map((quiz, qi) => (
                <Motion.li
                  key={quiz._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    {quiz.title || `Quiz ${qi + 1}`}
                  </h3>

                  {quiz.description && (
                    <p className="text-gray-700 mb-4">{quiz.description}</p>
                  )}

                  {quiz.questions?.length > 0 && (
                    <div className="space-y-4">
                      {quiz.questions.map((q, qIndex) => (
                        <div
                          key={qIndex}
                          className="bg-gray-50 border-l-4 border-blue-200 pl-4 py-2 rounded">
                          <p className="font-medium mb-1 text-gray-800">
                            Q{qIndex + 1}: {q.question}
                          </p>
                          <ul className="list-disc ml-6 space-y-1 text-sm">
                            {q.options.map((opt, i) => (
                              <li
                                key={i}
                                className={`${
                                  opt === q.correctAnswer
                                    ? "text-green-700 font-semibold"
                                    : "text-gray-700"
                                }`}>
                                {opt}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-gray-500 mt-1">
                            ✅ Correct Answer:{" "}
                            <span className="text-green-600 font-medium">
                              {q.correctAnswer || "N/A"}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Motion.li>
              ))}
            </Motion.ul>
          )}
        </div>
      </div>
    </>
  );
}

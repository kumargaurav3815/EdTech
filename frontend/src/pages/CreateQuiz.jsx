/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function CreateQuiz() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    classId: "",
    title: "",
    description: "",
    questions: [{ question: "", options: ["", "", "", ""], correct: 0 }],
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/class/my-classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setClasses(res.data));
  }, []);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...form.questions];
    if (field === "question") {
      updated[index].question = value;
    } else if (field.startsWith("option")) {
      const optIndex = parseInt(field.replace("option", ""));
      updated[index].options[optIndex] = value;
    } else if (field === "correct") {
      updated[index].correct = parseInt(value);
    }
    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        { question: "", options: ["", "", "", ""], correct: 0 },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedQuestions = form.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.options[q.correct],
      }));

      await axios.post(
        "/quiz/create",
        {
          classId: form.classId,
          title: form.title || "Untitled Quiz",
          description: form.description,
          questions: formattedQuestions,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      navigate(`/class/${form.classId}/quizzes`);
    } catch (err) {
      alert(err.response?.data?.message || "Quiz creation failed");
    }
  };

  return (
    <>
      <Navbar />
      <Motion.div
        className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100 px-4 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <Motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-8 space-y-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}>
          <h2 className="text-3xl font-bold text-center text-blue-700">
            📚 Create a New Quiz
          </h2>

          {/* Class Selection */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Select Class
            </label>
            <select
              name="classId"
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Choose Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Quiz Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., JavaScript Basics"
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Description (Optional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              placeholder="Brief overview of the quiz..."
              className="w-full px-4 py-2 border rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Questions Section */}
          {form.questions.map((q, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 p-4 rounded-2xl shadow-sm space-y-3">
              <label className="font-medium text-blue-600">
                Question {index + 1}
              </label>
              <input
                type="text"
                required
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                placeholder="Enter the question"
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">
                    Option {i + 1}
                  </label>
                  <input
                    type="text"
                    required
                    value={q.options[i]}
                    onChange={(e) =>
                      handleQuestionChange(index, `option${i}`, e.target.value)
                    }
                    placeholder={`Option ${i + 1}`}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}

              <div>
                <label className="block font-medium mt-3 mb-1 text-sm">
                  Correct Option
                </label>
                <select
                  value={q.correct}
                  onChange={(e) =>
                    handleQuestionChange(index, "correct", e.target.value)
                  }
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              type="button"
              onClick={addQuestion}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition hover:cursor-pointer">
              ➕ Add Another Question
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition hover:cursor-pointer">
              ✅ Submit Quiz
            </button>
          </div>
        </Motion.form>
      </Motion.div>
    </>
  );
}

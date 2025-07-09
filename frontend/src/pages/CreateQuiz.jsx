/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Select Class</label>
            <select
              name="classId"
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
              required
              className="w-full border px-3 py-2">
              <option value="">-- Choose Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Quiz Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              className="w-full border px-3 py-2"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Optional"
            />
          </div>

          {form.questions.map((q, index) => (
            <div key={index} className="border p-4 rounded shadow space-y-3">
              <label className="block font-medium">Question {index + 1}</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                required
              />

              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <label className="block text-sm">Option {i + 1}</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={q.options[i]}
                    onChange={(e) =>
                      handleQuestionChange(index, `option${i}`, e.target.value)
                    }
                    required
                  />
                </div>
              ))}

              <label className="block font-medium mt-2">Correct Option</label>
              <select
                value={q.correct}
                onChange={(e) =>
                  handleQuestionChange(index, "correct", e.target.value)
                }
                className="w-full border p-2 rounded"
                required>
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-200 px-4 py-2 rounded">
            + Add Question
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded ml-4">
            Submit Quiz
          </button>
        </form>
      </div>
    </>
  );
}

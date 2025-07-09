/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function CreateAssignment() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    classId: "",
    title: "",
    description: "",
    dueDate: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/class/my-classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setClasses(res.data))
      .catch(() => alert("Failed to load classes"));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 📅 Due Date Validation
    const today = new Date().setHours(0, 0, 0, 0);
    const selected = new Date(form.dueDate).setHours(0, 0, 0, 0);
    if (selected < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    setError("");
    try {
      console.log("Form submission data:", form);
      await axios.post("/assignment/create", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate(`/class/${form.classId}/assignments`);
    } catch (err) {
      console.error("Assignment creation error:", err);
      alert("Failed to create assignment");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Create New Assignment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Class
              </label>
              <select
                name="classId"
                onChange={handleChange}
                required
                className="w-full border px-3 py-2">
                <option value="">-- Select --</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                placeholder="Assignment details..."
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                value={form.dueDate}
                min={new Date().toISOString().split("T")[0]} // today onwards
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
              Create Assignment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

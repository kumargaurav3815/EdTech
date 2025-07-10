/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function CreateAssignment() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    classId: "",
    title: "",
    description: "",
    dueDate: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/class/my-classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setClasses(res.data))
      .catch(() => toast.error("Failed to load classes"));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().setHours(0, 0, 0, 0);
    const selected = new Date(form.dueDate).setHours(0, 0, 0, 0);
    if (selected < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    setError("");

    try {
      const fd = new FormData();
      fd.append("classId", form.classId);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("dueDate", form.dueDate);
      if (file) fd.append("file", file);

      const res = await axios.post("/assignment/create", fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`✅ ${res.data.message}`);
      setTimeout(() => navigate(`/class/${form.classId}/assignments`), 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create assignment");
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <Motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-pink-100 px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <Motion.form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-xl p-8 rounded-3xl shadow-xl border border-gray-200 space-y-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}>
          <h2 className="text-3xl font-bold text-center text-blue-600">
            📝 Create New Assignment
          </h2>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Select Class
            </label>
            <select
              name="classId"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500">
              <option value="">-- Select --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Assignment Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Unit 1 Worksheet"
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Description
            </label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              placeholder="Assignment details..."
              rows={4}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Due Date</label>
            <input
              type="date"
              name="dueDate"
              required
              value={form.dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Upload Assignment Questions (optional)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, DOCX, JPG, PNG
            </p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg font-semibold transition-all duration-300 hover:cursor-pointer">
            ➕ Create Assignment
          </button>
        </Motion.form>
      </Motion.div>
    </>
  );
}

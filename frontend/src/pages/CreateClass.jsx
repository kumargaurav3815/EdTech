/** @format */

import { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion as Motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function CreateClass() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/class/create",
        { title, description, videoLink: liveLink, date, duration },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Class created successfully 🎉");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create class ❌");
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
          className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-gray-200 space-y-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}>
          <h2 className="text-3xl font-bold text-center text-blue-600">
            🚀 Create New Class
          </h2>

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Physics Live Lecture"
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Short description of the class..."
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Live Link */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Live Class Link (Zoom / 100ms)
            </label>
            <input
              type="url"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
              placeholder="https://your-live-class-link.com"
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Class Date and Time */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Scheduled Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Duration (in minutes)
            </label>
            <input
              type="number"
              min="10"
              max="240"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              placeholder="e.g., 60"
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg font-semibold transition-all duration-300 hover:cursor-pointer">
            ➕ Create Class
          </button>
        </Motion.form>
      </Motion.div>
    </>
  );
}

/** @format */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";
import { motion as Motion } from "framer-motion";

export default function EditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");

  useEffect(() => {
    axios.get(`/class/${id}`).then((res) => {
      setName(res.data.name || res.data.title || "");
      setSchedule(res.data.schedule || "");
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/class/${id}`, { name, schedule });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-pink-100 flex items-center justify-center px-4 py-12">
        <Motion.form
          onSubmit={handleUpdate}
          className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold text-center text-blue-600">
            ✏️ Edit Class
          </h2>

          <div>
            <label className="block mb-1 font-medium text-sm">Class Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Class Name"
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Schedule</label>
            <input
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="e.g., Mon 5pm"
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-md font-semibold transition-all duration-300">
            💾 Save Changes
          </button>
        </Motion.form>
      </div>
    </>
  );
}

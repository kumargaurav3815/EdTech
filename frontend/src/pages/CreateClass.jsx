/** @format */

// src/pages/CreateClass.jsx
import { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateClass() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/class/create", { title, description, liveLink });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create class");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-xl font-bold mb-4">Create New Class</h2>

          <label className="block mb-2 text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border mb-4 rounded"
          />

          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border mb-4 rounded"
            required
          />

          <label className="block mb-2 text-sm font-medium">
            Live Class Link (e.g., Zoom or 100ms URL)
          </label>
          <input
            type="text"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            className="w-full p-2 border mb-4 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded">
            Create Class
          </button>
        </form>
      </div>
    </>
  );
}

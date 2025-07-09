/** @format */

// src/pages/OpenClass.jsx
import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function OpenClass() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/class/my-classes").then((res) => setClasses(res.data));
  }, []);

  const handleOpen = (e) => {
    e.preventDefault();
    if (!selectedClass) return alert("Please select a class to open.");
    navigate(`/class/${selectedClass}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Open Class</h2>
        <form onSubmit={handleOpen} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border px-3 py-2"
              required>
              <option value="">-- Choose Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Open Class
          </button>
        </form>
      </div>
    </>
  );
}

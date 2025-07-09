/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/class/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Classes received from API:", res.data);
      setClasses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert(err.response?.data?.message || "Failed to load classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid class ID");
      return;
    }

    const confirm = window.confirm(
      "Are you sure you want to delete this class?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`/class/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses((prev) => prev.filter((cls) => cls._id !== id));
      alert("Class deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Classes</h2>
          <button
            onClick={() => navigate("/class/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            + New Class
          </button>
        </div>

        {classes.length === 0 ? (
          <p className="text-gray-500">You have not created any classes yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div key={cls._id} className="p-4 border rounded shadow bg-white">
                <h3 className="font-semibold text-lg">{cls.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{cls.description}</p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/class/${cls._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Open Class
                  </button>
                  <button
                    onClick={() => navigate(`/class/${cls._id}/assignments`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Assignments
                  </button>
                  <button
                    onClick={() => navigate(`/class/${cls._id}/quizzes`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Quizzes
                  </button>

                  <button
                    onClick={() => navigate(`/class/${cls._id}/edit`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    Reschedule
                  </button>

                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

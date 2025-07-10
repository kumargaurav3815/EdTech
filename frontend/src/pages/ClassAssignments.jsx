/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";
import { motion as Motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function ClassAssignments() {
  const { id: classId } = useParams(); // classId from URL
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeToastId, setActiveToastId] = useState(null); // track active custom toast

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/assignment/class/${classId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Assignments:", res.data);
      setAssignments(res.data);
    } catch (err) {
      toast.dismiss(); // clear any prior
      toast.error(err.response?.data?.message || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [classId]);

  const handleDelete = (assignmentId) => {
    if (activeToastId) return; // prevent stacking confirmation modals

    const toastId = toast.custom((t) => (
      <div className="bg-white shadow-xl border border-gray-200 rounded-xl p-4 w-80 text-sm">
        <p className="text-gray-800 font-medium mb-2">⚠️ Confirm Deletion</p>
        <p className="text-gray-600">
          Are you sure you want to delete this assignment?
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setActiveToastId(null);
            }}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm">
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setActiveToastId(null);
              try {
                await axios.delete(`/assignment/${assignmentId}/${classId}`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });
                toast.success("✅ Assignment deleted!");
                setAssignments((prev) =>
                  prev.filter((a) => a._id !== assignmentId)
                );
              } catch (err) {
                toast.error("❌ Failed to delete assignment");
                console.error("Delete error:", err);
              }
            }}
            className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm">
            Yes, Delete
          </button>
        </div>
      </div>
    ));

    setActiveToastId(toastId);
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-pink-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Motion.h2
            className="text-3xl font-bold text-center text-blue-700 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            📚 Class Assignments
          </Motion.h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <Motion.p
              className="text-center text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}>
              No assignments found for this class.
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
              {assignments.map((a) => (
                <Motion.li
                  key={a._id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 relative"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}>
                  <h3 className="text-xl font-semibold text-blue-800">
                    {a.title}
                  </h3>
                  <p className="text-gray-700 mt-2">{a.description}</p>
                  <p className="text-sm text-gray-500 mt-3">
                    📅 Due Date:{" "}
                    {a.dueDate
                      ? new Date(a.dueDate).toLocaleDateString()
                      : "Not specified"}
                  </p>

                  {/* Show link to uploaded PDF */}
                  <a
                    href={a.upload}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline transition-all duration-300">
                    <span>View Attached File</span>
                  </a>

                  <button
                    onClick={() => handleDelete(a._id)}
                    className="absolute top-3 right-3 bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg text-sm font-medium transition">
                    Delete
                  </button>
                </Motion.li>
              ))}
            </Motion.ul>
          )}
        </div>
      </div>
    </>
  );
}

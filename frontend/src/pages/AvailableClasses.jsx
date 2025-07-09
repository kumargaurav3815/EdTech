/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function StudentAllClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/class/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setClasses(res.data); // Expecting array: [{ teacherId, _id, title, description, ... }]
        setLoading(false);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to fetch classes");
        setLoading(false);
      });
  }, []);

  const handleEnroll = async (classId, teacherId) => {
    try {
      await axios.post(
        "/class/enroll",
        { classId, teacherId }, // Pass both for embedded logic
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Enrolled successfully");
      setClasses((prev) => prev.filter((cls) => cls._id !== classId)); // Remove enrolled class
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Available Classes</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : classes.length === 0 ? (
          <p className="text-gray-500">No classes available to enroll.</p>
        ) : (
          classes.map((cls) => (
            <div
              key={cls._id}
              className="border p-4 mb-4 rounded shadow bg-white">
              <h3 className="text-xl font-semibold text-blue-800">
                {cls.title}
              </h3>

              <p className="text-sm text-gray-700 mb-1">
                <strong>Teacher:</strong> {cls.teacherName || "Unknown"}
              </p>

              {cls.description && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Description:</strong> {cls.description}
                </p>
              )}

              {cls.schedule && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Schedule:</strong>{" "}
                  {new Date(cls.schedule).toLocaleString()}
                </p>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEnroll(cls._id, cls.teacherId)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                  Enroll
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/student/class/${cls._id}?teacher=${cls.teacherId}`
                    )
                  }
                  className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

/** @format */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";

export default function EditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");

  useEffect(() => {
    axios.get(`/class/${id}`).then((res) => {
      setName(res.data.name);
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
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Class</h2>
        <form onSubmit={handleUpdate}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border mb-3 rounded"
            placeholder="Class Name"
            required
          />
          <input
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full p-2 border mb-3 rounded"
            placeholder="Schedule (e.g., Mon 5pm)"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}

/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/class/mine").then((res) => setClasses(res.data));
  }, []);
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Enrolled Classes</h2>
        {classes.length === 0 ? (
          <p>
            No enrolled classes yet.{" "}
            <span
              onClick={() => navigate("/student/classes")}
              className="text-blue-500 underline cursor-pointer">
              Browse Classes
            </span>
          </p>
        ) : (
          <ul className="space-y-2">
            {classes.map((cls) => (
              <li
                key={cls._id}
                className="border p-4 rounded shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/student/class/${cls._id}`)}>
                <h3 className="font-bold ">{cls.title}</h3>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

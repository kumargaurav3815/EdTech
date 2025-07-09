/** @format */

import { useEffect, useState } from "react";
import axios from "../api";
import Navbar from "../components/Navbar";

export default function StudentRecords() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/records/student").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Records</h2>

        <h3 className="text-xl font-semibold mb-2">Enrolled Classes</h3>
        <ul className="list-disc ml-6">
          {data.enrolledClasses.map((cls) => (
            <li key={cls._id}>{cls.title}</li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          Assignment Submissions
        </h3>
        <ul className="list-disc ml-6">
          {data.assignments.map((sub) => (
            <li key={sub._id}>
              Assignment: {sub.assignmentId} - Score: {sub.score}
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">Quiz Attempts</h3>
        <ul className="list-disc ml-6">
          {data.quizzes.map((quiz) => (
            <li key={quiz._id}>
              Quiz: {quiz.quizId} - Score: {quiz.score}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

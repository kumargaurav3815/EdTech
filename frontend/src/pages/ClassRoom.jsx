/** @format */

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ClassRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get(`/class/${id}`, { headers })
      .then((res) => setClassData(res.data))
      .catch((err) => alert(err.response?.data?.message || "Unauthorized"));

    axios
      .get(`/quiz/${id}`, { headers })
      .then((res) => setQuiz(res.data))
      .catch(() => setQuiz(null));

    const storedMessages = localStorage.getItem(`chat-${id}`);
    if (storedMessages) {
      setChatMessages(JSON.parse(storedMessages));
    }

    socket.emit("joinRoom", id);

    socket.on("chatMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on("userLeft", ({ role }) => {
      alert(`${role} left the class`);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("userLeft");
    };
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`chat-${id}`, JSON.stringify(chatMessages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, id]);

  const sendMessage = () => {
    const sender = localStorage.getItem("role") || "Teacher";
    if (message.trim()) {
      const msgData = {
        roomId: id,
        sender,
        message,
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      };
      socket.emit("chatMessage", msgData);
      setMessage("");
    }
  };

  const leaveClass = () => {
    const sender = localStorage.getItem("role") || "Teacher";
    socket.emit("leaveRoom", { roomId: id, sender });
    localStorage.removeItem(`chat-${id}`);
    navigate("/dashboard");
  };

  if (!classData) return <p className="p-4">Loading class...</p>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen">
        <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{classData.title}</h1>
            <p className="text-sm text-white/80">{classData.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(classData.liveLink, "_blank")}
              className="bg-green-600 text-white px-4 py-2 rounded">
              Start Class
            </button>
            <button
              onClick={leaveClass}
              className="bg-red-600 text-white px-4 py-2 rounded">
              Leave Class
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-y-hidden">
          {/* Live Video */}
          <iframe
            src={classData.liveLink}
            title="Live Class"
            allow="camera; microphone; fullscreen"
            className="w-1/2 h-full border-r"></iframe>

          {/* Chat */}
          <div className="flex flex-col w-1/2">
            <div className="h-full p-4 border-l bg-gray-50 flex flex-col">
              <h2 className="text-lg font-semibold mb-2">Live Chat</h2>
              <div className="flex-1 overflow-y-auto mb-2 border p-2 rounded bg-white">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="mb-1 text-sm">
                    <strong>{msg.sender}:</strong> {msg.message}
                    <span className="text-xs text-gray-500 ml-2">
                      {msg.time}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="Type your message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-1 rounded">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {quiz && Array.isArray(quiz.questions) && (
          <div className="p-6 border-t bg-white max-h-[40vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Quiz Preview</h2>
            {quiz.questions.map((q, idx) => (
              <div key={idx} className="mb-4">
                <p className="font-medium">
                  {idx + 1}. {q.question}
                </p>
                <ul className="ml-4 list-disc text-sm text-gray-700">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      {opt}{" "}
                      {i === q.correct && (
                        <strong className="text-green-600">(Correct)</strong>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

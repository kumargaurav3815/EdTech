/** @format */

// src/pages/StudentLiveClass.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api";
import Navbar from "../components/Navbar";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with deployed URL if needed

export default function StudentLiveClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`/class/${id}/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClassData(res.data.class);
      } catch (err) {
        console.error("Error fetching class data:", err);
        alert("Access denied or failed to load class.");
      }
    };

    fetchClass();
  }, [id]);

  useEffect(() => {
    socket.emit("joinRoom", id);

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("userLeft", ({ role }) => {
      alert(`${role} left the class`);
    });

    return () => {
      socket.emit("leaveRoom", { roomId: id, role: "Student" });
      socket.off("chatMessage");
      socket.off("userLeft");
    };
  }, [id]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const msgData = {
      roomId: id,
      sender: "Student",
      message: newMsg,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("chatMessage", msgData);
    setNewMsg("");
  };

  const leaveClass = () => {
    socket.emit("leaveRoom", { roomId: id, role: "Student" });
    navigate("/student/dashboard"); // redirect after leaving
  };

  if (!classData) return <p className="p-4">Loading class...</p>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{classData.title}</h2>
            <p className="text-sm text-white/80">{classData.description}</p>
          </div>
          <button
            onClick={leaveClass}
            className="bg-red-600 px-4 py-2 rounded text-white font-semibold">
            Leave Class
          </button>
        </header>

        {/* Main Content */}
        <div className="flex flex-1">
          <iframe
            src={classData.liveLink}
            title="Live Class"
            allow="camera; microphone; fullscreen"
            className="w-2/3 border-r"
          />

          {/* Chat */}
          <div className="flex flex-col w-1/3">
            <div className="h-full p-4 bg-gray-100 border-l flex flex-col">
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <div
                className="flex-1 overflow-y-auto space-y-1 text-sm"
                ref={chatRef}>
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    <strong>{msg.sender}:</strong> {msg.message}
                    <span className="text-xs text-gray-500 ml-2">
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex mt-3">
                <input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded-l"
                  placeholder="Type your message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-1 rounded-r">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

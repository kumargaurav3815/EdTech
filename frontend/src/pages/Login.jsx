/** @format */

import { useState } from "react";
import axios from "../api";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      toast.success("Login successful!");

      setTimeout(() => {
        if (role === "teacher") navigate("/redirect");
        else navigate("/student/classes");
      }, 1000); // Wait a bit before redirecting
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 to-pink-200 px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <Motion.form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl p-8 rounded-2xl space-y-5"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-center text-blue-700">
          🔐 Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-1">Login as:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg font-semibold transition-all duration-300">
          🚀 Login
        </button>

        <p className="text-sm text-center text-gray-700">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </Motion.form>
    </div>
  );
}

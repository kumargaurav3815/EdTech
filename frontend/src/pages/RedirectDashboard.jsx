/** @format */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      navigate("/login"); // Redirect to login if unauthenticated
    } else if (role === "teacher") {
      navigate("/dashboard");
    } else if (role === "student") {
      navigate("/student/dashboard");
    } else {
      navigate("/login"); // Default fallback
    }
  }, [navigate]);

  return null;
}

/** @format */

// middleware/auth.js
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role and find user accordingly
    let user;
    if (decoded.role === "teacher") {
      user = await Teacher.findById(decoded.id);
    } else if (decoded.role === "student") {
      user = await Student.findById(decoded.id);
    }

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = { id: user._id, role: decoded.role }; // Set user info
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;

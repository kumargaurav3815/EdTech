/** @format */

// controllers/recordController.js
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";

export const getAllStudents = async (req, res) => {
  try {
    // Optional: Check if role is teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await Student.find({}, "-password"); // exclude password
    res.json(students);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // ✅ Fetch classes using student's own enrolledClasses array
    const enrolledClasses = await Class.find({
      _id: { $in: student.enrolledClasses },
    }).populate("teacherId", "name");

    res.json({ student, enrolledClasses });
  } catch (err) {
    console.error("Error fetching student details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentRecordForTeacher = async (req, res) => {
  try {
    const { id: studentId } = req.params;

    const student = await Student.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrolledClassIds = (student.enrolledClasses || []).map((id) =>
      id.toString()
    );

    const teachers = await Teacher.find();

    const enrolledClasses = [];

    teachers.forEach((teacher) => {
      teacher.classes.forEach((cls) => {
        if (enrolledClassIds.includes(cls._id.toString())) {
          enrolledClasses.push({
            ...cls.toObject(),
            teacherId: { _id: teacher._id, name: teacher.name },
          });
        }
      });
    });

    res.json({
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
      },
      enrolledClasses,
    });
  } catch (err) {
    console.error("getStudentRecordForTeacher error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/** @format */

import Class from "../models/Class.js";
import Assignment from "../models/Assignment.js";
import Quiz from "../models/Quiz.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import mongoose from "mongoose";

export const createClass = async (req, res) => {
  const { title, description, videoLink, date, duration } = req.body;
  const teacherId = req.user.id;

  if (!title || !description || !date || !duration) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const parsedDate = new Date(date);
  const parsedDuration = Number(duration);

  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  if (isNaN(parsedDuration)) {
    return res.status(400).json({ message: "Invalid duration" });
  }

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const newClass = {
    _id: new mongoose.Types.ObjectId(),
    title,
    description,
    videoLink,
    date: parsedDate,
    duration: parsedDuration,
    enrolledStudents: [],
  };

  teacher.classes.push(newClass);
  await teacher.save();

  res.json({ message: "Class created", class: teacher.classes.at(-1) });
};

export const createAssignment = async (req, res) => {
  const { title, classId, dueDate, content } = req.body;
  const teacherId = req.user.id;

  const assignment = new Assignment({ title, classId, dueDate, content });
  await assignment.save();

  await Teacher.findByIdAndUpdate(teacherId, {
    $push: { assignments: assignment._id },
  });

  res.json({ message: "Assignment created", assignment });
};

export const createQuiz = async (req, res) => {
  const { title, classId, questions } = req.body;
  const teacherId = req.user.id;

  const quiz = new Quiz({ title, classId, questions });
  await quiz.save();

  await Teacher.findByIdAndUpdate(teacherId, {
    $push: { quizzes: quiz._id },
  });

  res.json({ message: "Quiz created", quiz });
};

export const getAllClasses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    const enrolledClassIds = student?.enrolledClasses || [];

    const teachers = await Teacher.find().lean();

    const availableClasses = [];

    teachers.forEach((teacher) => {
      if (Array.isArray(teacher.classes)) {
        teacher.classes.forEach((cls) => {
          const alreadyEnrolled = enrolledClassIds.some(
            (enrolledId) => enrolledId.toString() === cls._id.toString()
          );
          if (!alreadyEnrolled) {
            availableClasses.push({
              ...cls,
              teacherName: teacher.name,
              teacherId: teacher._id,
            });
          }
        });
      }
    });

    res.json(availableClasses);
  } catch (err) {
    console.error("Error in getAllClasses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const enrollInClass = async (req, res) => {
  const { classId } = req.body;
  const userId = req.user.id;

  const teacher = await Teacher.findOne({ "classes._id": classId });
  if (!teacher) return res.status(404).json({ message: "Class not found" });

  const cls = teacher.classes.id(classId);

  if (cls.enrolledStudents.includes(userId)) {
    return res.status(400).json({ message: "Already enrolled" });
  }

  cls.enrolledStudents.push(userId);
  await teacher.save();

  const student = await Student.findById(userId);
  if (!student.enrolledClasses.includes(classId)) {
    student.enrolledClasses.push(classId);
    await student.save();
  }

  res.json({ message: "Enrolled successfully" });
};

export const getStudentClasses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrolledClassIds = student.enrolledClasses || [];

    // Loop through all teachers to extract embedded classes
    const teachers = await Teacher.find();

    let enrolledClasses = [];

    teachers.forEach((teacher) => {
      teacher.classes.forEach((cls) => {
        if (enrolledClassIds.includes(cls._id.toString())) {
          enrolledClasses.push({
            ...cls.toObject(),
            teacherName: teacher.name,
            teacherId: teacher._id,
          });
        }
      });
    });

    res.json(enrolledClasses);
  } catch (err) {
    console.error("getStudentClasses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClassById = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. Teachers only." });
    }

    const teacher = await Teacher.findOne({
      _id: req.user.id,
      "classes._id": req.params.id,
    });

    if (!teacher) {
      return res
        .status(403)
        .json({ message: "Class not found or unauthorized." });
    }

    const classObj = teacher.classes.id(req.params.id);
    res.status(200).json(classObj);
  } catch (err) {
    console.error("getClassById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyClasses = async (req, res) => {
  const teacherId = req.user.id;
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  res.json(teacher.classes);
};

export const getClassDetails = async (req, res) => {
  try {
    const classId = req.params.id;
    const teacher = await Teacher.findOne({
      "classes._id": classId,
    }).select("classes name");

    if (!teacher) return res.status(404).json({ message: "Class not found" });

    const classObj = teacher.classes.id(classId);
    const teacherInfo = { name: teacher.name }; // or include more if needed

    const classData = {
      ...classObj.toObject(),
      teacherId: teacherInfo, // attach teacher name to class
    };

    res.json({
      class: classData,
      assignments: classObj.assignments || [],
      quizzes: classObj.quizzes || [],
    });
  } catch (err) {
    console.error("Error fetching class details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteClass = async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const classIndex = teacher.classes.findIndex(
    (cls) => cls._id.toString() === id
  );
  if (classIndex === -1)
    return res.status(403).json({ message: "Class not found or unauthorized" });

  teacher.classes.splice(classIndex, 1);
  await teacher.save();

  res.json({ message: "Class deleted successfully" });
};

export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { title, description, videoLink } = req.body;
  const teacherId = req.user.id;

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const cls = teacher.classes.id(id);
  if (!cls) return res.status(404).json({ message: "Class not found" });

  if (title !== undefined) cls.title = title;
  if (description !== undefined) cls.description = description;
  if (videoLink !== undefined) cls.videoLink = videoLink;

  await teacher.save();
  res.json({ message: "Class updated", class: cls });
};

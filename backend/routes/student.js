/** @format */

// POST /api/student/login
router.post("/login", async (req, res) => {
  const { email } = req.body;
  let student = await Student.findOne({ email });
  if (!student) student = await Student.create({ email });
  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
  res.json({ token });
});

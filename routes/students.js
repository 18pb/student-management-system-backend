const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { protect, authorize } = require("../middleware/auth");

// Admin view all students with complete profiles
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "name email")
      .populate("academicPerformance.course");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student view their own complete academic record profile
router.get("/profile", protect, authorize("student"), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate("user", "name email")
      .populate("academicPerformance.course");
    if (!student)
      return res.status(404).json({ message: "Student profile not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin assign/update grade and academic status for a specific student course entry
router.post("/:id/grade", protect, authorize("admin"), async (req, res) => {
  try {
    const { courseId, grade, score, status } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student record missing" });

    const existingRecordIndex = student.academicPerformance.findIndex(
      (item) => item.course.toString() === courseId,
    );

    if (existingRecordIndex > -1) {
      student.academicPerformance[existingRecordIndex].grade = grade;
      student.academicPerformance[existingRecordIndex].score = Number(score);
      student.academicPerformance[existingRecordIndex].status = status;
    } else {
      student.academicPerformance.push({
        course: courseId,
        grade,
        score: Number(score),
        status,
      });
    }

    await student.save();
    const updated = await student.populate("academicPerformance.course");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protect, authorize } = require("../middleware/auth");

// Public/Student Route: View all courses
router.get("/", protect, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Admin Only Route: Create a course
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Only Route: Delete a course
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted successfully" });
});

module.exports = router;

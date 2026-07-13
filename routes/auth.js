const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @route   POST api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, major } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await User.create({ name, email, password, role });

    if (role === "student") {
      const studentId = "STU" + Math.floor(100000 + Math.random() * 900000);
      await Student.create({
        user: user._id,
        studentId,
        major: major || "Computer Science",
        academicPerformance: [],
      });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Standard uniform token parsing context sync
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Setup fallback initialization route for old data compatibility
router.get("/init-profiles", async (req, res) => {
  try {
    const studentsWithoutProfiles = await User.find({ role: "student" });
    let createdCount = 0;
    for (let user of studentsWithoutProfiles) {
      const profileExists = await Student.findOne({ user: user._id });
      if (!profileExists) {
        const studentId = "STU" + Math.floor(100000 + Math.random() * 900000);
        await Student.create({
          user: user._id,
          studentId,
          major: "General Studies",
          academicPerformance: [],
        });
        createdCount++;
      }
    }
    res.json({ message: `Initialized ${createdCount} profiles.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

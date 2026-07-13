const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const studentRoutes = require("./routes/students"); // <-- Yeh line added hai

const app = express();

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes); // <-- Yeh line added hai

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server spinning up on port ${PORT}`));

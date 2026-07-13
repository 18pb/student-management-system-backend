const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: String,
    credits: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", CourseSchema);

const mongoose = require("mongoose");

const AcademicRecordSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  grade: { type: String, uppercase: true, default: "N/A" },
  score: { type: Number, min: 0, max: 100, default: 0 },
  status: {
    type: String,
    enum: ["Enrolled", "Completed", "Failed"],
    default: "Enrolled",
  },
});

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: { type: String, required: true, unique: true },
    major: { type: String, default: "General Studies" },
    academicPerformance: [AcademicRecordSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", StudentSchema);

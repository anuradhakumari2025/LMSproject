const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseProgressSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    completed: { type: Boolean, default: false },
    lectureCompleted: [],
  },
  {
    minimize: false,
  }
);

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

module.exports = CourseProgress;

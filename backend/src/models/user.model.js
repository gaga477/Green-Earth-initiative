const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  points: Number,
  createdAt: { type: Date, default: Date.now }
});

const SubmissionSchema = new mongoose.Schema({
  userId: String,
  taskId: String,
  imageUrl: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);
const Submission = mongoose.model("Submission", SubmissionSchema);

module.exports = { User, Task, Submission };

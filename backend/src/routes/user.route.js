const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { User, Task, Submission } = require("../models/user.model");

router.post("/register", register);
router.post("/login", login);

router.get("/leaderboard", async (req, res) => {
  const users = await User.find().sort({ points: -1 }).limit(10);
  res.json(users);
});

router.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post("/submit", async (req, res) => {
  const { userId, taskId, imageUrl } = req.body;
  const submission = await Submission.create({ userId, taskId, imageUrl });
  const task = await Task.findById(taskId);
  if (task) {
    await User.findByIdAndUpdate(userId, { $inc: { points: task.points } });
  }
  res.json(submission);
});

module.exports = router;

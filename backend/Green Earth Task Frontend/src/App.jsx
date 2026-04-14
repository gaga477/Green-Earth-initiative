import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const api = axios.create({ baseURL: "/api", timeout: 10000 });

const mockTasks = [
  { _id: "1", title: "Pick 5 pieces of waste", description: "Clean your environment", points: 10 },
  { _id: "2", title: "Plant a tree", description: "Grow green life", points: 50 }
];

const mockLeaderboard = [
  { _id: "u1", name: "Eco Hero", points: 120 },
  { _id: "u2", name: "Green Warrior", points: 90 }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [isLogin, setIsLogin] = useState(true);

  const auth = async () => {
    try {
      const url = isLogin ? "/login" : "/register";
      const res = await api.post(url, form);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      setError("");
    } catch (err) {
      setError("⚠️ Login/Register failed. Check backend connection.");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchLeaderboard();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      setTasks(mockTasks);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");
      setLeaderboard(res.data);
    } catch {
      setLeaderboard(mockLeaderboard);
    }
  };

  const submitTask = async (taskId) => {
    if (!user) return alert("Login required");
    try {
      await api.post("/submit", {
        userId: user._id,
        taskId,
        imageUrl: file ? file.name : "demo.jpg"
      });
      alert("Task submitted 🌱");
    } catch {
      alert("Submission failed - backend offline");
    }
  };

  if (!user) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#dcfce7" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{ padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: 320 }}>
          <h1 style={{ marginBottom: 16 }}>🌍 Green Earth Login</h1>

          {error && <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>{error}</p>}

          {!isLogin && (
            <input placeholder="Name" style={inputStyle}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          )}
          <input placeholder="Email" style={inputStyle}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" style={inputStyle}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <button onClick={auth} style={btnStyle}>
            {isLogin ? "Login" : "Register"}
          </button>

          <p onClick={() => setIsLogin(!isLogin)}
            style={{ fontSize: 13, marginTop: 8, textAlign: "center", cursor: "pointer", color: "#16a34a" }}>
            {isLogin ? "Create account" : "Already have account"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #bbf7d0, #4ade80)", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1>🌍 Green Earth Dashboard</h1>
        <div style={{ background: "#fff", padding: "4px 12px", borderRadius: 8 }}>
          Points: {user.points || 0}
        </div>
      </div>

      <h2 style={{ marginBottom: 8 }}>🎮 Daily Tasks</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {tasks.map((t) => (
          <motion.div key={t._id} whileHover={{ scale: 1.02 }}
            style={{ padding: 16, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <h3 style={{ margin: 0 }}>{t.title}</h3>
            <p style={{ fontSize: 13, color: "#555" }}>{t.description}</p>
            <p style={{ color: "#16a34a", fontWeight: "bold" }}>+{t.points} points</p>
            <input type="file" style={{ marginTop: 8 }} onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={() => submitTask(t._id)} style={{ ...btnStyle, marginTop: 8, width: "auto", padding: "6px 16px" }}>
              Submit Proof 🌱
            </button>
          </motion.div>
        ))}
      </div>

      <h2 style={{ marginTop: 24, marginBottom: 8 }}>🏆 Leaderboard</h2>
      <div style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
        {leaderboard.map((u, i) => (
          <div key={u._id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "6px 0" }}>
            <span>#{i + 1} {u.name}</span>
            <span>{u.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: 8, border: "1px solid #ccc",
  borderRadius: 6, marginBottom: 8, boxSizing: "border-box"
};

const btnStyle = {
  width: "100%", padding: 10, background: "#16a34a",
  color: "#fff", border: "none", borderRadius: 6, cursor: "pointer"
};

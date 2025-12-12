import express from "express";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/users", auth, requireAdmin, async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
});

router.post("/user/:id/ban", auth, requireAdmin, async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: "Not found" });
  u.banned = true;
  await u.save();
  res.json({ message: "User banned" });
});

router.post("/user/:id/unban", auth, requireAdmin, async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: "Not found" });
  u.banned = false;
  await u.save();
  res.json({ message: "User unbanned" });
});

export default router;
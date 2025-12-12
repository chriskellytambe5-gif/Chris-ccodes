import express from "express";
import Message from "../models/Message.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { to, text } = req.body;
  if (!text) return res.status(400).json({ message: "No text" });

  const m = new Message({ from: req.user._id, to: to || null, text });
  await m.save();
  res.json(m);
});

router.get("/global", auth, async (req, res) => {
  const msgs = await Message.find({ to: null }).sort({ createdAt: -1 }).limit(200).populate("from", "name avatarUrl");
  res.json(msgs.reverse());
});

router.get("/private/:otherId", auth, async (req, res) => {
  const otherId = req.params.otherId;
  const msgs = await Message.find({
    $or: [
      { from: req.user._id, to: otherId },
      { from: otherId, to: req.user._id }
    ]
  }).sort({ createdAt: 1 }).populate("from", "name avatarUrl");
  res.json(msgs);
});

export default router;
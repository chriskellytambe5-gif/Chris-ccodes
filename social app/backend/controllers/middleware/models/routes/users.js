import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.get("/me", auth, async (req, res) => {
  const u = await User.findById(req.user._id).select("-passwordHash");
  res.json(u);
});

router.put("/me", auth, upload.single("avatar"), async (req, res) => {
  const { name, bio } = req.body;
  if (name) req.user.name = name;
  if (bio) req.user.bio = bio;
  if (req.file) req.user.avatarUrl = /uploads/${req.file.filename};
  await req.user.save();
  res.json({ message: "Updated", user: req.user });
});

router.get("/:id", auth, async (req, res) => {
  const u = await User.findById(req.params.id).select("-passwordHash");
  if (!u) return res.status(404).json({ message: "Not found" });
  res.json(u);
});

router.get("/", auth, async (req, res) => {
  const q = req.query.q || "";
  const users = await User.find({ name: { $regex: q, $options: "i" } }).limit(30).select("-passwordHash");
  res.json(users);
});

export default router;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies?.token;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    if (user.banned) return res.status(403).json({ message: "User banned" });

    req.user = user;
    next();
  } catch (err) {
    console.error("auth error:", err);
    return res.status(401).json({ message: "Auth failed" });
  }
};
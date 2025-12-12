import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_KEY = process.env.ADMIN_KEY;

if (!MONGO_URI || !ADMIN_KEY) {
  console.error("Set MONGO_URI and ADMIN_KEY in .env");
  process.exit(1);
}

const args = process.argv.slice(2);
const [name, email, password, key] = args;
if (!name || !email || !password || !key) {
  console.error("Usage: node createAdmin.js <name> <email> <password> <ADMIN_KEY>");
  process.exit(1);
}
if (key !== ADMIN_KEY) {
  console.error("ADMIN_KEY mismatch");
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const existing = await User.findOne({ email });
    if (existing) {
      console.error("User exists. Exiting.");
      process.exit(1);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role: "admin" });
    await user.save();
    console.log("Admin user created:", user.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const exists = await User.findOne({ email: "alice@example.com" });
    if (exists) { console.log("Seed already executed"); process.exit(0); }

    const list = [
      { name: "Alice", email: "alice@example.com", password: "password1" },
      { name: "Bob", email: "bob@example.com", password: "password2" },
      { name: "Carol", email: "carol@example.com", password: "password3" }
    ];

    for (const u of list) {
      const hash = await bcrypt.hash(u.password, 10);
      await new User({ name: u.name, email: u.email, passwordHash: hash }).save();
    }
    console.log("Seed completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
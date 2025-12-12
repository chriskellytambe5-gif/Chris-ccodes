import mongoose from "mongoose";
const FRSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending","accepted","declined"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("FriendRequest", FRSchema);
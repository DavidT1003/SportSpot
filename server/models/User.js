import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true, trim: true },
    prezime: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

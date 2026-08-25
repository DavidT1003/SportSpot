import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    sport: { type: String, required: true, trim: true },
    grad: { type: String, required: true, trim: true },
    adresa: { type: String, required: true, trim: true },
    opis: { type: String, default: "", trim: true },
    datum: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dolazci: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    sport: { type: String, required: true, trim: true },
    grad: { type: String, required: true, trim: true },
    adresa: { type: String, required: true, trim: true },
    opis: { type: String, default: "", trim: true },
    datum: { type: String, required: true },
    // Namjerno bez required: stari oglasi nemaju vrijeme, a Mongoose
    // validira cijeli dokument pri svakom save() (npr. kod prijave dolaska).
    // Obaveznost se provjerava u ruti pri kreiranju novog oglasa.
    vrijeme: { type: String, default: "", trim: true },
    // Broj igraca koji se traze. null = stari oglas bez kvote (neograniceno).
    kapacitet: { type: Number, default: null, min: 1 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dolazci: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);

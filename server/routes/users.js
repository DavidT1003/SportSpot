import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";

const router = express.Router();

// Javni profil korisnika + njegovi oglasi.
// Namjerno se ne vraca email ni lozinka - profil moze vidjeti bilo tko.
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Bez ove provjere findById baca CastError na neispravan ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Korisnik ne postoji." });
    }

    const user = await User.findById(id).select("ime prezime createdAt");
    if (!user) {
      return res.status(404).json({ message: "Korisnik ne postoji." });
    }

    const posts = await Post.find({ user: id })
      .populate("user", "ime prezime")
      .sort({ createdAt: -1 });

    res.json({
      user: {
        id: user._id,
        ime: user.ime,
        prezime: user.prezime,
        createdAt: user.createdAt,
      },
      posts,
    });
  } catch {
    res.status(500).json({ message: "Greška na serveru." });
  }
});

export default router;

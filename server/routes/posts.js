import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Dohvati sve oglase (najnoviji prvi)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "ime prezime")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// Kreiraj oglas
router.post("/", auth, async (req, res) => {
  try {
    const { sport, grad, adresa, opis, datum } = req.body;
    if (!sport || !grad || !adresa || !datum) {
      return res.status(400).json({ message: "Sport, grad, adresa i datum su obavezni." });
    }

    const post = await Post.create({
      sport,
      grad,
      adresa,
      opis: opis || "",
      datum,
      user: req.userId,
      dolazci: [],
    });

    const populated = await post.populate("user", "ime prezime");
    res.status(201).json(populated);
  } catch {
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// Uredi opis (samo vlasnik)
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Oglas ne postoji." });
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Nemate dozvolu." });
    }

    post.opis = req.body.opis ?? post.opis;
    await post.save();

    const populated = await post.populate("user", "ime prezime");
    res.json(populated);
  } catch {
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// Pridruži se oglasu
router.post("/:id/join", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Oglas ne postoji." });

    if (post.user.toString() === req.userId) {
      return res.status(400).json({ message: "Ne možete se pridružiti vlastitom oglasu." });
    }
    if (post.dolazci.some((id) => id.toString() === req.userId)) {
      return res.status(400).json({ message: "Već ste prijavljeni na ovaj oglas." });
    }

    post.dolazci.push(req.userId);
    await post.save();

    const populated = await post.populate("user", "ime prezime");
    res.json(populated);
  } catch {
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// Obriši oglas (samo vlasnik)
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Oglas ne postoji." });
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Nemate dozvolu." });
    }

    await post.deleteOne();
    res.json({ message: "Oglas obrisan." });
  } catch {
    res.status(500).json({ message: "Greška na serveru." });
  }
});

export default router;

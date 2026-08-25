import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

function makeToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return { id: user._id, ime: user.ime, prezime: user.prezime, email: user.email };
}

// Registracija
router.post("/register", async (req, res) => {
  try {
    const { ime, prezime, email, password } = req.body;
    if (!ime || !prezime || !email || !password) {
      return res.status(400).json({ message: "Sva polja su obavezna." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email je već registriran." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ ime, prezime, email, password: hashed });

    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// Prijava
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email i lozinka su obavezni." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Neispravni podaci za prijavu." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Neispravni podaci za prijavu." });
    }

    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Greška na serveru." });
  }
});

export default router;

import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors());
app.use(express.json());

// Konekcija se otvara po zahtjevu (i kesira se), jer serverless funkcija
// nema trajni proces u kojem bi se spojila jednom pri pokretanju.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Greška pri spajanju na MongoDB:", err.message);
    res.status(503).json({ message: "Baza trenutno nije dostupna." });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

const status = (req, res) => res.json({ status: "SportSpot API radi" });
app.get("/", status);
app.get("/api", status);

export default app;

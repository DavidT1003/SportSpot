import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => res.json({ status: "SportSpot API radi" }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Povezano na MongoDB");
    app.listen(PORT, () => console.log(`Server sluša na portu ${PORT}`));
  })
  .catch((err) => {
    console.error("Greška pri spajanju na MongoDB:", err.message);
    process.exit(1);
  });

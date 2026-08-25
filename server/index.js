// Lokalno pokretanje (npm run dev). Na Vercelu se koristi api/index.js.
import "dotenv/config";
import app from "./app.js";
import connectDB from "./db.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Povezano na MongoDB");
    app.listen(PORT, () => console.log(`Server sluša na portu ${PORT}`));
  })
  .catch((err) => {
    console.error("Greška pri spajanju na MongoDB:", err.message);
    process.exit(1);
  });

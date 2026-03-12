import express from "express";
import itemsRouter from "./routes/items.js";
import currencyRouter from "./routes/currency.js";
import prefsRouter from "./routes/prefs.js";

const app = express();
app.use(express.json());

app.use("/api/items", itemsRouter);
app.use("/api/currency", currencyRouter);
app.use("/api/prefs", prefsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Wishlist API running on http://localhost:${PORT}`);
});

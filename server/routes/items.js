import { Router } from "express";
import { getAllItems, replaceAllItems } from "../db.js";

const router = Router();

router.get("/", (_req, res) => {
  try {
    const items = getAllItems();
    res.json(items);
  } catch (err) {
    console.error("GET /api/items error:", err);
    res.status(500).json({ error: "Failed to load items" });
  }
});

router.put("/", (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Body must be an array" });
    }
    replaceAllItems(req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /api/items error:", err);
    res.status(500).json({ error: "Failed to save items" });
  }
});

export default router;

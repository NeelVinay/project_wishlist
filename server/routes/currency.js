import { Router } from "express";
import { getPref, setPref } from "../db.js";

const router = Router();

router.get("/", (_req, res) => {
  try {
    const code = getPref("currency");
    res.json({ code });
  } catch (err) {
    console.error("GET /api/currency error:", err);
    res.status(500).json({ error: "Failed to load currency" });
  }
});

router.put("/", (req, res) => {
  try {
    setPref("currency", req.body.code || null);
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /api/currency error:", err);
    res.status(500).json({ error: "Failed to save currency" });
  }
});

export default router;

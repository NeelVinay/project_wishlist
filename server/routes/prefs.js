import { Router } from "express";
import { getPref, setPref } from "../db.js";

const router = Router();

router.get("/:key", (req, res) => {
  try {
    const raw = getPref(req.params.key);
    const value = raw !== null ? JSON.parse(raw) : null;
    res.json({ value });
  } catch (err) {
    console.error(`GET /api/prefs/${req.params.key} error:`, err);
    res.status(500).json({ error: "Failed to load preference" });
  }
});

router.put("/:key", (req, res) => {
  try {
    setPref(req.params.key, JSON.stringify(req.body.value));
    res.json({ ok: true });
  } catch (err) {
    console.error(`PUT /api/prefs/${req.params.key} error:`, err);
    res.status(500).json({ error: "Failed to save preference" });
  }
});

export default router;

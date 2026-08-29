import express from "express";
import { decodePhrase } from "../services/ai.js";
import { requireAuth } from "../middleware/requireauth.js";
import { pool } from "../db/pool.js";

const router = express.Router();

router.post("/decode", requireAuth, async (req, res) => {
  const { phrase, register } = req.body;

  if (!phrase) {
    return res.status(400).json({ error: "Phrase is required" });
  }

  try {
    const result = await decodePhrase(phrase, register || "formal");

    try {
      await pool.query(
        `INSERT INTO saved_phrases
          (user_id, input, pinyin, literal, natural_meaning, tags, example, cultural_context, register)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          req.user.id,
          result.input,
          result.pinyin,
          result.literal,
          result.natural,
          result.tags,
          result.example,
          result.cultural_context,
          register || "formal",
        ],
      );
    } catch (saveErr) {
      console.error("Auto-save failed (non-blocking):", saveErr);
    }

    res.json(result);
  } catch (err) {
    console.error("Decode error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong decoding that phrase" });
  }
});

export default router;

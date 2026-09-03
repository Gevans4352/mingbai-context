import express from "express";
import rateLimit from "express-rate-limit";
import { decodePhrase } from "../services/ai.js";
import { requireAuth } from "../middleware/requireauth.js";
import { pool } from "../db/pool.js";
import { readFileSync } from "fs";

const router = express.Router();

const decodeLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: { error: "Too many decode requests, slow down a bit." },
});

const slangDict = JSON.parse(
  readFileSync(new URL("../data/slang.json", import.meta.url)),
);

const slangLookup = {};
for (const [key, entry] of Object.entries(slangDict)) {
  slangLookup[key.toLowerCase()] = entry;
  slangLookup[entry.input] = entry;
}

function findSlangEntry(phrase) {
  const trimmed = phrase.trim();
  return slangLookup[trimmed] || slangLookup[trimmed.toLowerCase()] || null;
}

router.post("/decode", decodeLimiter, requireAuth, async (req, res) => {
  const { phrase, register, mode = "standard" } = req.body;

  if (!phrase) {
    return res.status(400).json({ error: "Phrase is required" });
  }

  try {
    const dictEntry = findSlangEntry(phrase);
    if (dictEntry) {
      const modeKey = register === "genz" ? "genz" : "formal";
      const variant = dictEntry[modeKey];
      const result = {
        input: dictEntry.input,
        pinyin: dictEntry.pinyin,
        literal: dictEntry.literal,
        natural: variant.natural,
        tags: dictEntry.tags,
        example: variant.example,
        cultural_context: variant.cultural_context,
      };

      try {
        await pool.query(
          `INSERT INTO saved_phrases
            (user_id, input, pinyin, literal, natural_meaning, tags, example, cultural_context, register, mode)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
            mode,
          ],
        );
      } catch (saveErr) {
        console.error("Auto-save failed (non-blocking):", saveErr);
      }

      return res.json({
        ...result,
        register: register || "formal",
        cached: false,
        source: "dictionary",
      });
    }

    const cacheQuery = `
      SELECT pinyin, literal, natural_meaning, tags, example, cultural_context, register
      FROM saved_phrases
      WHERE input = $1 AND mode = $2
      LIMIT 1
    `;
    const cached = await pool.query(cacheQuery, [phrase, mode]);

    if (cached.rows.length > 0) {
      const row = cached.rows[0];
      return res.json({
        input: phrase,
        pinyin: row.pinyin,
        literal: row.literal,
        natural: row.natural_meaning,
        tags: row.tags,
        example: row.example,
        cultural_context: row.cultural_context,
        register: row.register,
        cached: true,
      });
    }

    const result = await decodePhrase(phrase, register || "formal", mode);
    try {
      await pool.query(
        `INSERT INTO saved_phrases
          (user_id, input, pinyin, literal, natural_meaning, tags, example, cultural_context, register, mode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
          mode,
        ],
      );
    } catch (saveErr) {
      console.error("Auto-save failed (non-blocking):", saveErr);
    }
    res.json({ ...result, cached: false, source: "ai" });
  } catch (err) {
    console.error("Decode error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong decoding that phrase" });
  }
});

export default router;

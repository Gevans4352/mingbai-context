import express from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/requireauth.js";

const router = express.Router();

router.post("/save", requireAuth, async (req, res) => {
  const {
    input,
    pinyin,
    literal,
    natural,
    tags,
    example,
    cultural_context,
    register,
  } = req.body;

  if (!input) {
    return res.status(400).json({ error: "input is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO saved_phrases
        (user_id, input, pinyin, literal, natural_meaning, tags, example, cultural_context, register)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user.id,
        input,
        pinyin,
        literal,
        natural,
        tags,
        example,
        cultural_context,
        register,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Something went wrong saving that phrase" });
  }
});

router.get("/history", requireAuth, async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const [result, countResult] = await Promise.all([
      pool.query(
        `SELECT * FROM saved_phrases WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [req.user.id, limit, offset],
      ),
      pool.query(`SELECT COUNT(*) FROM saved_phrases WHERE user_id = $1`, [
        req.user.id,
      ]),
    ]);

    res.json({
      items: result.rows,
      total: parseInt(countResult.rows[0].count),
    });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Something went wrong fetching history" });
  }
});

router.delete("/history/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM saved_phrases WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Phrase not found" });
    }

    res.json({ message: "Deleted", deleted: result.rows[0] });
  } catch (err) {
    console.error("Delete error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong deleting that phrase" });
  }
});

export default router;

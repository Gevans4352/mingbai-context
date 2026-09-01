import express from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/requireauth.js";

const router = express.Router();
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const userResult = await pool.query(
      `SELECT name, email, country, default_register FROM users WHERE id = $1`,
      [req.user.id],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];
    const statsResult = await pool.query(
      `SELECT COUNT(*) as total_decodes FROM saved_phrases WHERE user_id = $1`,
      [req.user.id],
    );
    const tagResult = await pool.query(
      `SELECT UNNEST(tags) as tag, COUNT(*) 
       FROM saved_phrases 
       WHERE user_id = $1 
       GROUP BY tag 
       ORDER BY count DESC 
       LIMIT 1`,
      [req.user.id],
    );

    const total_decodes = parseInt(statsResult.rows[0].total_decodes);
    const top_tag = tagResult.rows[0]?.tag || null;
    res.json({
      ...user,
      total_decodes,
      top_tag,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Something went wrong fetching profile" });
  }
});

router.patch("/profile", requireAuth, async (req, res) => {
  const { name, email, country, default_register } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, country = $3, default_register = $4
       WHERE id = $5
       RETURNING name, email, country, default_register`,
      [name, email, country, default_register, req.user.id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Something went wrong updating profile" });
  }
});

export default router;

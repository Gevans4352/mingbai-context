import { pool } from "./pool.js";

async function setup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        email text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        country text,
        created_at timestamptz DEFAULT now()
      );
    `);
    console.log("users table created (or already existed)");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_phrases (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        input text NOT NULL,
        pinyin text,
        literal text,
        natural_meaning text,
        tags text[],
        example jsonb,
        cultural_context text,
        register text,
        created_at timestamptz DEFAULT now()
      );
    `);
    console.log("saved_phrases table created (or already existed)");

    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS default_register text DEFAULT 'formal';
    `);
    console.log("default_register column added (or already existed)");
  } catch (err) {
    console.error("Setup failed:", err);
  } finally {
    await pool.end();
  }
}

setup();

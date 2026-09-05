import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import decodeRoute from "./routes/decode.js";
import profileRoute from "./routes/profile.js";
import authRoute from "./routes/auth.js";
import phrasesRoute from "./routes/phrases.js";
import cookieParser from "cookie-parser";
import "./db/pool.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api", decodeRoute);
app.use("/api", authRoute);
app.use("/api", phrasesRoute);
app.use("/api", profileRoute);

app.get("/", (req, res) => {
  res.json({ message: "Míngbai backend is alive" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

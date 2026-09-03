import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function decodePhrase(phrase, register, mode = "standard") {
  const prompt = buildPrompt(phrase, register, mode);
  const result = await genAI.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });
  const text = result.text;
  return parseResponse(text);
}

function buildPrompt(phrase, register, mode) {
  let voice =
    register === "genz"
      ? "casual, playful, Gen Z internet voice like explaining to a friend over text"
      : "clear, neutral, and informative like a well-written reference explanation";
  if (mode === "meme") {
    voice =
      "hilarious, chaotic, meme-savvy internet dweller explaining with humor and cultural references";
  }
  let instruction = `
You are an expert on Chinese internet culture, slang, and idioms.

Analyze this phrase: "${phrase}"

Write your explanation in a ${voice} tone for the "natural", "example", and "cultural_context" fields.
Keep "literal" and "pinyin" accurate and neutral regardless of tone.
Keep "cultural_context" to 2-3 sentences maximum.
Choose 1-3 tags from this exact list only: dramatic, sarcastic, wholesome, memeable, formal, chaotic, resigned, playful.
If genuinely relevant, include up to 2 short related cultural terms in "related_culture" (e.g. a festival, custom, or concept connected to this phrase's meaning) — each with the term, its pinyin, and a one-sentence note. Only include this field if there's a real, non-forced connection. Omit it entirely if nothing fits.
`;
  if (mode === "meme") {
    instruction += `
This is MEME MODE. Focus heavily on internet memes, viral trends, and how this phrase is used in memes.
Explain the meme origin, the irony, and why it's funny. Use Gen Z slang and emoji-like expressions in your explanation.
The "example" should be a meme-worthy scenario.
`;
  } else {
    instruction += `
This is STANDARD MODE. Provide a clear, informative breakdown suitable for learning.
`;
  }

  instruction += `
Respond with ONLY valid JSON, no markdown formatting, no backticks, in exactly this shape:

{
  "input": "the original phrase",
  "pinyin": "pinyin with tone marks",
  "literal": "literal word-for-word translation",
  "natural": "natural English meaning",
  "tags": ["tag1", "tag2"],
  "related_culture": [
  { "term": "春节", "pinyin": "chūn jié", "note": "one sentence connecting it to this phrase" }
  ]
  "example": {
    "scenario": "a short relatable situation",
    "usage": "how the phrase would be used in that situation",
    "meaning_here": "what it means in that specific context"
  },
  "cultural_context": "brief cultural explanation"
}
`;

  return instruction;
}

function parseResponse(text) {
  let cleaned = text.trim();
  const jsonFence = "```json";
  const plainFence = "```";
  if (cleaned.indexOf(jsonFence) === 0) {
    cleaned = cleaned.substring(jsonFence.length);
  } else if (cleaned.indexOf(plainFence) === 0) {
    cleaned = cleaned.substring(plainFence.length);
  }
  const lastFenceIndex = cleaned.lastIndexOf(plainFence);
  if (lastFenceIndex !== -1) {
    cleaned = cleaned.substring(0, lastFenceIndex);
  }
  return JSON.parse(cleaned.trim());
}

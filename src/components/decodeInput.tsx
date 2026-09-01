import { useState } from "react";
import type { DecodeResult } from "../types";

interface DecodeInputProps {
  onDecode: (result: DecodeResult) => void;
  register: "genz" | "formal";
}

function DecodeInput({ onDecode, register }: DecodeInputProps) {
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phrase.trim()) return;

    setLoading(true);
    try {
      // Derive mode from register
      const mode = register === "genz" ? "meme" : "standard";

      const response = await fetch("http://localhost:5000/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phrase,
          register,
          mode, // <-- now derived, not from state
        }),
      });

      if (!response.ok) {
        console.error("Decode failed:", response.status);
        return;
      }

      const data: DecodeResult = await response.json();
      onDecode(data);
    } catch (err) {
      console.error("Failed to decode:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        placeholder="Paste a Chinese phrase, idiom, or slang..."
      />
      <button type="submit" disabled={loading}>
        {loading ? "Decoding..." : "Decode"}
      </button>
    </form>
  );
}

export default DecodeInput;
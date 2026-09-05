import { useState } from "react";
import type { DecodeResult } from "../types";
import { API_URL } from "../config";

interface DecodeInputProps {
  onDecode: (result: DecodeResult) => void;
  register: "genz" | "formal";
  onLoadingChange: (loading: boolean) => void;
}

function DecodeInput({
  onDecode,
  register,
  onLoadingChange,
}: DecodeInputProps) {
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phrase.trim()) return;

    setLoading(true);
    onLoadingChange(true);
    try {
      const mode = register === "genz" ? "meme" : "standard";
      const response = await fetch(`${API_URL}/api/decode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phrase,
          register,
          mode,
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
      onLoadingChange(false);
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

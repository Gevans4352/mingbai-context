import { useEffect, useState } from "react";
import DecodeInput from "../components/decodeInput";
import ScrollingScript from "../components/scrollingScript";
import type { DecodeResult } from "../types";

function Home() {
  const [results, setResults] = useState<DecodeResult[]>([]);
  const [register, setRegister] = useState<"genz" | "formal">("formal");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      register === "genz" ? "genz" : "formal",
    );
  }, [register]);

  function handleNewResult(result: DecodeResult) {
    setResults((prev) => [result, ...prev]);
    setExpandedIndex(0); // auto-expand the newest one
  }

  function toggleExpand(index: number) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  return (
    <div data-theme={register === "genz" ? "genz" : undefined}>
      <button
        onClick={() => setRegister(register === "genz" ? "formal" : "genz")}
      >
        {register === "genz" ? "Dark mode" : "Light mode"}
      </button>
      <ScrollingScript />
      <p className="section-label">01 / Decode</p>

      <h1>
        Decode the internet's <span className="accent">Chinese.</span>
      </h1>

      <DecodeInput onDecode={handleNewResult} register={register} />

      {results.length > 0 && (
        <div className="history-grid">
          {results.map((result, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div className="card" key={i}>
                <p className="zh-text">{result.input}</p>
                <p>{result.pinyin}</p>
                <p>{result.natural}</p>

                <div>
                  {result.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="card-footer">
                  <button onClick={() => toggleExpand(i)}>
                    {isExpanded ? "collapse" : "expand"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="expanded-context">
                    <p>{result.literal}</p>

                    <p className="section-label">Example</p>
                    <p>{result.example.scenario}</p>
                    <p className="zh-text">{result.example.usage}</p>
                    <p>{result.example.meaning_here}</p>

                    <p className="section-label">Cultural context</p>
                    <p>{result.cultural_context}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;

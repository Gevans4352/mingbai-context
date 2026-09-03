import { useEffect, useState } from "react";
import DecodeInput from "../components/decodeInput";
import ScrollingScript from "../components/scrollingScript";
import type { DecodeResult } from "../types";

function Home() {
  const [results, setResults] = useState<DecodeResult[]>([]);
  const [register, setRegister] = useState<"genz" | "formal">("formal");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", register);
  }, [register]);

  function handleNewResult(result: DecodeResult) {
    setResults((prev) => [result, ...prev]);
    setExpandedIndex(0);
  }

  function toggleExpand(index: number) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  return (
    <>
      <ScrollingScript />
      <div className="home-page">
        <p className="section-label">01 / Decode</p>

        <h1>
          Decode the internet's <span className="accent">Chinese.</span>
        </h1>
        <div className="register-toggle">
          <button
            className={register === "formal" ? "active" : ""}
            onClick={() => setRegister("formal")}
          >
            Formal
          </button>
          <button
            className={register === "genz" ? "active" : ""}
            onClick={() => setRegister("genz")}
          >
            Gen Z
          </button>
        </div>

        <DecodeInput
          onDecode={handleNewResult}
          register={register}
          onLoadingChange={setIsDecoding}
        />

        {(results.length > 0 || isDecoding) && (
          <div className="history-grid">
            {isDecoding && (
              <div className="skeleton-card">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line long"></div>
                <div className="skeleton-line medium"></div>
              </div>
            )}
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
                  {result.related_culture &&
                    result.related_culture.length > 0 && (
                      <>
                        <p className="section-label">Related</p>
                        <div className="culture-tags">
                          {result.related_culture.map((item) => (
                            <div className="culture-chip" key={item.term}>
                              <span className="zh-text">{item.term}</span>
                              <span className="pinyin">{item.pinyin}</span>
                              <span className="culture-note">{item.note}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;

import { useState, useEffect } from "react";
import BackButton from "../components/backButton";

interface HistoryItem {
  id: string;
  input: string;
  pinyin: string;
  natural: string;
  tags: string[];
  cultural_context: string;
  created_at: string;
}

const LIMIT = 8;

function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  useEffect(() => {
    let active = true;

    async function fetchHistory() {
      setLoading(true);
      try {
        const offset = (page - 1) * LIMIT;
        const response = await fetch(
          `http://localhost:5000/api/history?limit=${LIMIT}&offset=${offset}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          if (active) {
            setItems([]);
            setTotal(0);
          }
          return;
        }

        const data = await response.json();
        if (active) {
          setItems(Array.isArray(data.items) ? data.items : []);
          setTotal(typeof data.total === "number" ? data.total : 0);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
        if (active) {
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchHistory();

    return () => {
      active = false;
    };
  }, [page]);

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  function goToPage(p: number) {
    if (p < 1 || p > totalPages) return;
    setExpandedId(null);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pageNumbers() {
    const nums: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }

  return (
    <div>
      <BackButton />
      <p className="section-label">02 / History</p>
      <h1>
        Your <span className="accent">Archive</span>
      </h1>

      {loading && (
        <div className="history-grid">
          {[1, 2, 3, 4].map((i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="section-label">No decoded phrases yet.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="history-grid">
          {items.map((item) => (
            <div className="card" key={item.id}>
              <p className="zh-text">{item.input}</p>
              <p className="pinyin">{item.pinyin}</p>

              <div>
                {item.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <p>{item.natural}</p>

              <div className="card-footer">
                <span className="date-label">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <button onClick={() => toggleExpand(item.id)}>
                  {expandedId === item.id ? "collapse" : "expand"}
                </button>
              </div>

              {expandedId === item.id && (
                <p className="expanded-context">{item.cultural_context}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => goToPage(page - 1)} disabled={page === 1}>
            ‹
          </button>

          {pageNumbers().map((num) => (
            <button
              key={num}
              className={num === page ? "page-active" : ""}
              onClick={() => goToPage(num)}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default History;
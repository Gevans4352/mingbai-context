import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        明白 <span>MÍNGBAI</span>
      </div>
      <p className="footer-tagline">
        A curated entry into internet slang, memes, and the poetry of modern
        China.
      </p>
      <div className="footer-links">
        <Link to="/privacy">Privacy</Link>
        <a
          href="https://github.com/Gevans4352/mingbai-context"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
      <p className="footer-copy">◇ EST. 2026 ◇</p>
    </footer>
  );
}

export default Footer;

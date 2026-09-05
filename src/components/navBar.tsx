import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { API_URL } from "../config";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  async function handleLogout() {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    window.location.href = "/";
  }
  return (
    <>
      <nav className="nav-bar">
        <Link to="/" className="nav-logo">
          明白 <span>MÍNGBAI</span>
        </Link>

        <div className="nav-links-desktop">
          <Link to="/history">History</Link>
          <Link to="/profile">Profile</Link>
          <p
            className="logout"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            LogOut
          </p>
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-overlay">
          <button
            className="nav-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          <div className="nav-links-mobile">
            <Link to="/history" onClick={() => setMenuOpen(false)}>
              History
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import { API_URL } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        return;
      }
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-constellation" aria-hidden="true">
        <span className="auth-emoji" style={{ top: "10%", left: "15%" }}>
          ✧
        </span>
        <span className="auth-emoji" style={{ top: "80%", right: "10%" }}>
          ✦
        </span>
        <span className="auth-emoji" style={{ bottom: "15%", left: "25%" }}>
          ⋆
        </span>
        <span className="auth-emoji" style={{ top: "20%", right: "30%" }}>
          ☾
        </span>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-red-tab"></div>
        <div className="auth-label">02 / SECURE LOGIN</div>
        <h2 className="auth-title">
          Log <span>In.</span>
        </h2>

        <div className="auth-fields">
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {error && <div className="auth-error">✧ {error}</div>}

        <button className="auth-button" type="submit">
          LOG IN →
        </button>

        <div className="auth-switch">
          <span>New here?</span> <Link to="/register">CREATE ACCOUNT</Link>
        </div>

        <div className="auth-footer">✧ EST. 2026 ✧</div>
      </form>
    </div>
  );
}

export default Login;

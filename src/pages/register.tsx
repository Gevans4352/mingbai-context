import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import { API_URL } from "../config";

function Register() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, country, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Registration failed");
        return;
      }
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("Something went wrong");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-constellation" aria-hidden="true">
        <span className="auth-emoji" style={{ top: "15%", right: "20%" }}>
          ✧
        </span>
        <span className="auth-emoji" style={{ bottom: "20%", left: "10%" }}>
          ✦
        </span>
        <span className="auth-emoji" style={{ top: "70%", right: "15%" }}>
          ⋆
        </span>
        <span className="auth-emoji" style={{ top: "10%", left: "30%" }}>
          ☾
        </span>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-red-tab"></div>
        <div className="auth-label">01 / CREATE ACCOUNT</div>
        <h2 className="auth-title">
          Become a <span>Decoded</span>
        </h2>

        <div className="auth-fields">
          <input
            className="auth-input"
            type="text"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <select
            className="auth-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select country</option>
            <option value="NG">Nigeria</option>
            <option value="GH">Ghana</option>
            <option value="KE">Kenya</option>
            <option value="ZA">South Africa</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="CN">China</option>
          </select>
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
          REGISTER →
        </button>

        <div className="auth-switch">
          <span>Already have an account?</span> <Link to="/login">LOG IN</Link>
        </div>

        <div className="auth-footer">✧ FORMAL MODE ✧</div>
      </form>
    </div>
  );
}

export default Register;

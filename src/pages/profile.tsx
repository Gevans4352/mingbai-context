import { useState, useEffect } from "react";
import "../styles/profile.css";
import FloatingEmojis from "../components/floatingEmojis";
import BackButton from "../components/backButton";

interface ProfileData {
  name: string;
  email: string;
  country: string;
  default_register: "genz" | "formal";
  total_decodes: number;
  top_tag: string | null;
}

interface HistoryItem {
  id: string;
  input: string;
  pinyin: string;
  natural_meaning: string;
  tags: string[];
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileData | null>(null);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setForm(data);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }

      try {
        const res = await fetch("http://localhost:5000/api/history?limit=8", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        country: form.country,
        default_register: form.default_register,
      };
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile((prev) => ({
          ...updated,
          total_decodes: prev?.total_decodes ?? 0,
          top_tag: prev?.top_tag ?? null,
        }));
        setForm((prev) => ({
          ...updated,
          total_decodes: prev?.total_decodes ?? 0,
          top_tag: prev?.top_tag ?? null,
        }));
        setEditing(false);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  }

  if (!profile || !form) {
    return (
      <div className="profile-page">
        <div className="profile-main">
          
          <p className="section-label">02 / Profile</p>
          <h1>
            Loading<span className="accent">...</span>
          </h1>

          <p className="section-label" style={{ marginTop: "2.5rem" }}>
            Recent Decodes
          </p>
          <div className="masonry-grid">
            {[1, 2, 3, 4].map((i) => (
              <div className="masonry-skeleton-card" key={i}>
                <div className="skel-line w40"></div>
                <div className="skel-line w60"></div>
                <div className="skel-line w80"></div>
                <div className="skel-line w60"></div>
              </div>
            ))}
          </div>
        </div>

        <aside className="infobox-skeleton">
          <div className="skel-title"></div>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div className="skel-row" key={i}>
              <div className="skel-label"></div>
              <div className="skel-value"></div>
            </div>
          ))}
        </aside>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <FloatingEmojis />
      <div className="profile-main">
        <BackButton />
        <p className="section-label">02 / Profile</p>
        <h1>
          The Archive of <span className="accent">{profile.name}.</span>
        </h1>
        <p className="profile-byline">
          A running record of every phrase decoded, every idiom explained.
        </p>

        <p className="section-label" style={{ marginTop: "2.5rem" }}>
          Recent Decodes
        </p>
        <div className="masonry-grid">
          {items.map((item) => (
            <div className="card masonry-card" key={item.id}>
              <p className="zh-text">{item.input}</p>
              <p className="pinyin">{item.pinyin}</p>
              <p>{item.natural_meaning}</p>
              <div>
                {item.tags?.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="section-label">No decodes yet.</p>
          )}
        </div>
      </div>

      <aside className="infobox">
        <p className="infobox-title">{profile.name}</p>

        <div className="infobox-row">
          <span className="infobox-label">Name</span>
          {editing ? (
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          ) : (
            <span className="infobox-value">{profile.name}</span>
          )}
        </div>

        <div className="infobox-row">
          <span className="infobox-label">Email</span>
          {editing ? (
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          ) : (
            <span className="infobox-value">{profile.email}</span>
          )}
        </div>

        <div className="infobox-row">
          <span className="infobox-label">Country</span>
          {editing ? (
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          ) : (
            <span className="infobox-value">{profile.country}</span>
          )}
        </div>

        <div className="infobox-row">
          <span className="infobox-label">Default Mode</span>
          {editing ? (
            <select
              value={form.default_register}
              onChange={(e) =>
                setForm({
                  ...form,
                  default_register: e.target.value as "genz" | "formal",
                })
              }
            >
              <option value="formal">Formal</option>
              <option value="genz">Gen Z</option>
            </select>
          ) : (
            <span className="infobox-value">
              {profile.default_register === "genz" ? "Gen Z" : "Formal"}
            </span>
          )}
        </div>
        <div className="infobox-row">
          <span className="infobox-label">Decodes</span>
          <span className="infobox-value">{profile.total_decodes}</span>
        </div>
        <div className="infobox-row">
          <span className="infobox-label">Top Tag</span>
          <span className="infobox-value">{profile.top_tag || "—"}</span>
        </div>

        {editing ? (
          <div className="infobox-actions">
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setForm(profile);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
      </aside>
    </div>
  );
}

export default Profile;

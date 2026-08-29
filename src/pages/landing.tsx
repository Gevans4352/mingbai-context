
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const FANCY_EMOJIS = ['✧', '⋆', '☾', '♡', '❖', '⟡', '✩', '✦', '✶', '♢'];

interface EmojiProps {
  char: string;
  style: React.CSSProperties;
}

const FloatingEmoji: React.FC<EmojiProps> = ({ char, style }) => {
  return (
    <span className="landing-emoji" style={style}>
      {char}
    </span>
  );
};


export default function LandingPage() {
  const [emojis, setEmojis] = useState<EmojiProps[]>([]);
  const [enter, setEnter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const newEmojis = FANCY_EMOJIS.map((char, index) => ({
      char,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${4 + Math.random() * 6}s`,
      }
    }));
    setEmojis(newEmojis);
  }, []);

  const handleEnter = () => {
    setEnter(true);
    navigate('/register');
  };

  return (
    <div className={`landing-wrap ${enter ? 'landing-exit' : ''}`}>
      {/* Background Constellation of Fancy Emojis */}
      <div className="landing-constellation">
        {emojis.map((e, i) => (
          <FloatingEmoji key={i} char={e.char} style={e.style} />
        ))}
      </div>

      {/* The Main Centerpiece: Vertical Chinese Calligraphy */}
      <div className="landing-center">
        <div className="landing-label">02 / ENTER</div>
        
        <div className="landing-scroll">
          {/* Using the exact same vertical brush font logic */}
          <div className="landing-char">旧</div>
          <div className="landing-char">信</div>
          <div className="landing-char">纸</div>
          <div className="landing-char">上</div>
          <div className="landing-char">的</div>
          <div className="landing-char">字</div>
        </div>

        <div className="landing-title-block">
          <h1 className="landing-title">THE DIGITAL<br/><span className="landing-accent">INK.</span></h1>
          <p className="landing-subtitle">A curated entry into internet slang, memes, and the poetry of modern China.</p>
          
          <button className="landing-button" onClick={handleEnter}>
            ENTER THE ARCHIVE <span className="button-arrow">→</span>
          </button>
        </div>
      </div>
      <div className="landing-footer">
        <span className="footer-left">✧ <span className="footer-text">FORMAL MODE</span> ✧</span>
        <span className="footer-right">EST. 2026</span>
      </div>
    </div>
  );
}
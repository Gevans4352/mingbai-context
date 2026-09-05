function Privacy() {
  return (
    <div className="legal-page">
      <p className="section-label">03 / Privacy</p>
      <h1>
        How Your <span className="accent">Data</span> Is Handled
      </h1>

      <div className="legal-body">
        <p>
          Míngbai is a personal project, not a company. This page exists so you
          know exactly what happens with your information if you make an
          account.
        </p>

        <p className="section-label">What gets collected</p>
        <p>
          Your name, email, country, and a securely hashed version of your
          password. Passwords are never stored in plain text. Every phrase you
          decode gets saved to your history so you can look back on it later.
        </p>

        <p className="section-label">Where your phrases go</p>
        <p>
          When you decode a phrase, the text is sent to Google's Gemini API to
          generate the explanation. That's the only outside service that ever
          sees what you paste in. Nothing else is shared with anyone.
        </p>

        <p className="section-label">How you stay logged in</p>
        <p>
          Login uses a secure httpOnly cookie, meaning the token that keeps you
          logged in can't be read or touched by JavaScript on this site or any
          other. It's not stored in your browser's localStorage.
        </p>

        <p className="section-label">Deleting your data</p>
        <p>
          Since this is a small personal project without a self-service delete
          option yet, reach out directly if you'd like your account and history
          removed, and it'll be done by hand.
        </p>

        <p className="section-label">Changes</p>
        <p>
          If anything here changes as the project grows, this page will be
          updated to reflect it.
        </p>
      </div>
    </div>
  );
}

export default Privacy;

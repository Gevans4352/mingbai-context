import { Link } from "react-router-dom";

function BackButton() {
  return (
    <Link to="/home" className="back-button">
      <span className="back-arrow">↶</span>
      <span>back to decode</span>
      <span className="back-twinkle">✦</span>
    </Link>
  );
}

export default BackButton;

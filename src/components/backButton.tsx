import { Link } from "react-router-dom";

function BackButton() {
  return (
    <Link to="/home" className="back-button">
      ‹ back to decode
    </Link>
  );
}

export default BackButton;

import "./css/feedback.css";
import feedbackIcon from "../assets/ratings.png";

export default function FeedbackButton() {
  const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScdp0R9wqfxDPFF69PruQNSiJxjP8vSevxR35yFH9mbaU_dHQ/viewform?embedded=true";
  return (
    <button
      className="feedback-fab"
      aria-label="Feedback"
      onClick={() => window.open(FEEDBACK_FORM_URL, "_blank")}
    >
      <img src={feedbackIcon} alt="Feedback" />
    </button>
  );
}
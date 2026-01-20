import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Lights from "../components/Lights";
import FeedbackButton from "../components/FeedbackButton";
import "./css/LandingPage.css";

export default function LandingPage(){
    const navigate = useNavigate();
    const [rulesOpen, setRulesOpen] = useState(false);
    
    const handleCreate = () => {
        navigate("/CreatePage");
    };

    return (
        <div className="landing-page">
          <Lights count={12} fixed={true} height={90} />
          <main className="landing-content">
            <h1 className="landing-title">BUZZ</h1>

            <div className="landing-buttons">
                <button className="landing-btn">Join!</button>
                <button className="landing-btn" onClick={handleCreate}>Create.</button>
                <button className="landing-btn" onClick={() => setRulesOpen(true)}>Rules?</button>
            </div>
          </main>
          <FeedbackButton/>

          {/*Rules Popup*/}
          {rulesOpen && (
            <div className="popup-overlay" onClick={() => setRulesOpen(false)}>
                <div className="popup" onClick={(e) => e.stopPropagation()}>
                    <button
                    className="popup-close"
                    onClick={() => setRulesOpen(false)}
                    aria-label="Close rules"
                    />

                    <h2>Rules?</h2>
                    <p>
                    Piqued favour stairs it enable exeter as seeing. Remainder met improving but engrossed sincerity age. Better but length denied abroad are. Attachment astonished to on appearance imprudence so collecting in excellence. Tiled way blind lived whose new. The for fully had she there leave merit enjoy forth
                    </p>
                </div>
            </div>
          )}
        </div>
    );
}

// import { useNavigate } from "react-router-dom";
import Lights from "../components/Lights";
import FeedbackButton from "../components/FeedbackButton";
import "./css/LandingPage.css";

export default function LandingPage(){
    // const navigate = useNavigate();

    return (
        <div className="landing-page">
          <Lights count={12} fixed={true} height={90} />
          <main className="landing-content">
            <h1 className="landing-title">BUZZ</h1>

            <div className="landing-buttons">
                <button className="landing-btn">Join!</button>
                <button className="landing-btn">Create.</button>
                <button className="landing-btn">Rules?</button>
            </div>
          </main>
          <FeedbackButton/>
        </div>
    );
}

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
                        <div className="popup-content">
                        <p>
                            <strong>Objective</strong><br />
                            Guess your opponent's selected character before they guess yours.
                        </p>
                        <p>
                            <strong>Setup</strong><br />
                            One player creates a lobby, and the other player joins using the lobby code generated upon creation. The host selects a theme, and both players choose up to 25 characters to play with.<br />
                            For preset themes, players select from the available characters. For custom themes, each player may upload characters, with the total number of characters on the board capped at 25. The final set of characters used in the game is agreed upon by both players.<br />
                            The game begins once 25 characters have been selected between both players.
                        </p>
                        <p>
                            <strong>Gameplay</strong><br />
                            1.  You will be randomly assigned a character out of the available 25.<br />
                            2.  Each round, you will ask one yes-or-no question that will bring you closer to guessing your opponent's character.<br />
                            3.  You may guess your opponent's character after the first round is complete, however, this action will end the game.<br />
                            4.  You may mark which characters you believe are not in the hand of the opponent by selecting the 'eliminate' button and selecting the individual characters on your board, or you may right click on the characters to do so.<br />
                        </p>
                    </div>
                </div>
            </div>
          )}
        </div>
    );
}

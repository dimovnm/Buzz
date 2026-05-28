import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Lights from "../components/Lights";
import FeedbackButton from "../components/FeedbackButton";
import "./css/LandingPage.css";

export default function LandingPage(){
    const navigate = useNavigate();
    const [joinOpen, setJoinOpen] = useState(false);
    const [rulesOpen, setRulesOpen] = useState(false);
    const [digits, setDigits] = useState(["", "", "", "", ""]);
    const [joinError, setJoinError] = useState("");
    const inputRefs = useRef([]);

    const handleCreate = () => {
        navigate("/CreatePage");
    };

    const handleJoinClose = () => {
        setJoinOpen(false);
        setDigits(["", "", "", "", ""]);
        setJoinError("");
    };

    const handleDigitChange = (index, e) => {
        const val = e.target.value.replace(/[^0-9]/g, "").slice(-1);
        const newDigits = [...digits];
        newDigits[index] = val;
        setDigits(newDigits);
        setJoinError("");
        if (val && index < 4) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && digits[index] === "" && index > 0) {
            const newDigits = [...digits];
            newDigits[index - 1] = "";
            setDigits(newDigits);
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 5);
        if (!pasted) return;
        const newDigits = Array(5).fill("").map((_, i) => pasted[i] || "");
        setDigits(newDigits);
        inputRefs.current[Math.min(pasted.length, 4)].focus();
    };

    const handleJoin = () => {
        const code = digits.join("");
        if (code.length < 5) {
            setJoinError("Please enter the full 5-digit code.");
            return;
        }
        // TODO: validate code against backend — replace this navigate with an API call
        // If the lobby doesn't exist, call setJoinError("Incorrect code. Please try again.");
        navigate(`/${code}`);
    };

    return (
        <div className="landing-page">
          <Lights count={12} fixed={true} height={90} />
          <main className="landing-content">
            <h1 className="landing-title">BUZZ</h1>

            <div className="landing-buttons">
                <button className="landing-btn" onClick={() => setJoinOpen(true)}>Join!</button>
                <button className="landing-btn" onClick={handleCreate}>Create.</button>
                <button className="landing-btn" onClick={() => setRulesOpen(true)}>Rules?</button>
            </div>
          </main>
          <FeedbackButton/>

          {joinOpen && (
            <div className="popup-overlay" onClick={handleJoinClose}>
                <div className="join-popup" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="popup-close"
                        onClick={handleJoinClose}
                        aria-label="Close join"
                    />
                    <h2>Join!</h2>
                    <p className="join-code-label">Enter Code</p>
                    <div className="popup-content join-content">
                        <form
                            className="join-code-form"
                            onSubmit={(e) => { e.preventDefault(); handleJoin(); }}
                        >
                            {digits.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className="popup-input"
                                    value={digit}
                                    onChange={(e) => handleDigitChange(i, e)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={handlePaste}
                                    autoFocus={i === 0}
                                    aria-label={`Digit ${i + 1} of 5`}
                                />
                            ))}
                        </form>
                        {joinError && <p className="join-error">{joinError}</p>}
                        <button className="popup-btn" type="button" onClick={handleJoin}>ENTER</button>
                    </div>
                </div>
            </div>
          )}

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
                            1. You will be randomly assigned a character out of the available 25.<br />
                            2. Each round, you will ask one yes-or-no question that will bring you closer to guessing your opponent's character.<br />
                            3. You may guess your opponent's character after the first round is complete, however, this action will end the game.<br />
                            4. You may mark which characters you believe are not in the hand of the opponent by selecting the 'eliminate' button and selecting the individual characters on your board, or you may right click on the characters to do so.<br />
                        </p>
                    </div>
                </div>
            </div>
          )}
        </div>
    );
}

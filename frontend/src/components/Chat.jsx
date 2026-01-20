/*
* chat.jsx taken from last-man-playing github repo
* changes made - use Tailwind and remove chat.css
*/
import { useState } from "react";
import "./css/Chat.css";

export default function Chat() {
  const [msgs, setMsgs] = useState([]);
  const [inputVal, setInputVal] = useState("");

  function handleSend() {
    if (!inputVal.trim()) return;
    setMsgs((prev) => [
      ...prev,
      { username: "You", text: inputVal },
    ]);
    setInputVal("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat">
      <div className="chat-messages">
        {msgs.map((m, i) => (
          <div key={i}>
            <strong>{m.username}</strong>: {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}


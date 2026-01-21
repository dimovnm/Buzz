import { useState, useRef, useEffect } from "react";
import sendIcon from "../assets/send.png";

export default function Chat() {
  const [msgs, setMsgs] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const bottomRef = useRef(null);

  function handleSend() {
    if (!inputVal.trim()) return;
    setMsgs((prev) => [...prev, { username: "You", text: inputVal }]);
    setInputVal("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <div className="h-full flex flex-col text-white">
      <div className="flex-1 overflow-y-auto px-3 py-3 buzz-scroll">
        {msgs.map((m, i) => (
          <div key={i} className="text-sm my-1">
            <span className="font-semibold">{m.username}</span>: {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="h-[56px] w-full bg-black flex items-center px-3 gap-2">
        <input
          className="flex-1 bg-black text-white placeholder-white/60 outline-none text-sm"
          placeholder="Type here to chat"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSend}
          className="w-[24px] h-[24px] flex items-center justify-center opacity-90 hover:opacity-100"
          aria-label="Send"
          type="button"
        >
          <img src={sendIcon} alt="" className="w-[24px] h-[24px] object-contain" />
        </button>
      </div>
    </div>
  );
}

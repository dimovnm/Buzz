import React, { useState} from "react";
// import { useNavigate } from "react-router-dom";
// import {socket} from "../lib/socket";
//import "./css/CreatePage.css";
import Chat from "../components/Chat";

function generateLobbyCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

import rect11 from "../assets/Rectangle 11.png";
import rect12 from "../assets/Rectangle 12.png";
import rect13 from "../assets/Rectangle 13.png";
import rect14 from "../assets/Rectangle 14.png";
import rect15 from "../assets/Rectangle 15.png";
import rect16 from "../assets/Rectangle 16.png";
import rect17 from "../assets/Rectangle 17.png";
import rect18 from "../assets/Rectangle 18.png";

const CATEGORIES = [
  { key: "custom", label: "CUSTOM", img: null },
  { key: "actors", label: "ACTORS", img: rect12 },
  { key: "artists", label: "ARTISTS", img: rect11 },
  { key: "streamers", label: "STREAMERS", img: rect14 },
  { key: "youtubers", label: "YOUTUBERS", img: rect13 },
  { key: "historical", label: "HISTORICAL", img: rect15 },
  { key: "politicians", label: "POLITICIANS", img: rect16 },
  { key: "athletes", label: "ATHLETES", img: rect17 },
  { key: "fictional", label: "FICTIONAL", img: rect18 },
];

export default function CreatePage() {
  const [lobbyId] = useState(() => {
    const saved = localStorage.getItem("lobbyId");
    if (saved) return saved;
    const code = generateLobbyCode();
    localStorage.setItem("lobbyId", code);
    return code;
  });

  return (
    <div className="min-h-screen bg-buzzbg text-white">
      <div className="flex min-h-screen">
        <div className="flex-1 px-[clamp(16px,4vw,80px)] pt-[clamp(16px,3vw,40px)]">
          <div className="font-luckiest text-buzzpanel text-[clamp(44px,5vw,75px)] leading-none">
            CODE: {lobbyId}
          </div>

          <div className="mt-[clamp(16px,3vw,40px)]">
            <div className="grid grid-cols-3 gap-x-[clamp(18px,3vw,50px)] gap-y-[clamp(22px,3.5vw,46px)]">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className="text-center"
                  onClick={() => console.log("clicked", c.key)}
                >
                  <div className="w-[clamp(200px,18vw,290px)] h-[clamp(140px,12vw,200px)] rounded-[15px] bg-buzzpanel shadow-buzz flex items-center justify-center">
                  <div className="w-[calc(100%-40px)] h-[clamp(90px,8vw,140px)] rounded-[12px] border-[4px] border-buzzborder overflow-hidden flex items-center justify-center bg-buzzpanel">
                      {c.img ? (
                        <img
                          src={c.img}
                          alt={c.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-luckiest text-[clamp(40px,4vw,64px)] text-black leading-none">
                          +
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 font-luckiest text-[clamp(26px,3.2vw,50px)] text-buzzpanel leading-none">
                    {c.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[330px] h-screen bg-black/50">
          <Chat />
        </div>
      </div>
    </div>
  );
}
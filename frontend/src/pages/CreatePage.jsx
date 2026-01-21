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
        <div className="w-[1110px] relative">
          <div className="absolute left-[80px] top-[51px] font-luckiest text-[75px] text-buzzpanel leading-none">
            
            CODE: {lobbyId}
          </div>
          <div className="absolute left-[80px] top-[140px]">
            <div className="grid grid-cols-3 gap-x-[50px] gap-y-[86px]">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className="text-center"
                  onClick={() => console.log("clicked", c.key)}
                >
                  <div className="w-[290px] h-[200px] rounded-[15px] bg-buzzpanel shadow-buzz flex items-center justify-center">
                    <div className="w-[250px] h-[140px] rounded-[12px] border-[4px] border-buzzborder overflow-hidden flex items-center justify-center bg-buzzpanel">
                      {c.img ? (
                        <img
                          src={c.img}
                          alt={c.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-luckiest text-[64px] text-black leading-none">
                          +
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 font-luckiest text-[50px] text-buzzpanel leading-none">
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
import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
// import {socket} from "../lib/socket";

import Chat from "../components/Chat";

function generateLobbyCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

import plus from "../assets/plus.png";
import rect11 from "../../public/themes/createpage/Rectangle 11.png";
import rect12 from "../../public/themes/createpage/Rectangle 12.png";
import rect13 from "../../public/themes/createpage/Rectangle 13.png";
import rect14 from "../../public/themes/createpage/Rectangle 14.png";
import rect15 from "../../public/themes/createpage/Rectangle 15.png";
import rect16 from "../../public/themes/createpage/Rectangle 16.png";
import rect17 from "../../public/themes/createpage/Rectangle 17.png";
import rect18 from "../../public/themes/createpage/Rectangle 18.png";

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

function CategoryTile({ c, lobbyId, navigate }) {
  const handleClick = () => {
    if (c.key === "custom") {
      navigate(`/${lobbyId}/custom`);
    } else {
      navigate(`/${lobbyId}/${c.key}`);
    }
  };

  return (
    <button
      className="text-center min-w-0 w-full"
      onClick={handleClick}
    >
      <div
        className="
          mx-auto
          rounded-[15px]
          bg-buzzpanel
          shadow-buzz
          flex items-center justify-center
          p-[clamp(12px,1.6vw,18px)]
          w-full max-w-[310px]
        ">
        <div
          className="
            w-full
            max-w-[252px]
            aspect-[252/170]
            rounded-[12px]
            overflow-hidden
            border-[3px]
            border-buzzpanel/75
            bg-buzzpanel
          ">
          {c.img ? (
            <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={plus}
                alt="Custom"
                className="w-[clamp(60px,6vw,90px)] h-[clamp(60px,6vw,90px)] object-contain"/>

            </div>
          )}
        </div>
      </div>

      <div className="mt-3 font-luckiest text-[clamp(22px,3vw,50px)] text-buzzpanel leading-none">
        {c.label}
      </div>
    </button>
  );
}

export default function CreatePage() {
  const navigate = useNavigate();
  const [lobbyId] = useState(() => {
    const saved = localStorage.getItem("lobbyId");
    if (saved) return saved;
    const code = generateLobbyCode();
    localStorage.setItem("lobbyId", code);
    return code;
  });

  return (
  <div className="h-screen bg-buzzbg text-white overflow-hidden">
    {/* chat */}
    <div className="fixed right-0 top-0 h-screen w-[clamp(280px,26vw,330px)] bg-black/50 z-[2000]">
      <Chat />
    </div>

    {/* left side */}
    <div className="h-screen pr-[clamp(280px,26vw,330px)]">
      <div className="h-full px-[clamp(16px,4vw,80px)] pt-[clamp(16px,3vw,40px)] flex flex-col">
        {/* header */}
        <div className="font-luckiest text-buzzpanel text-[clamp(44px,5vw,75px)] leading-none">
          CODE: {lobbyId}
        </div>

        {/* grid area */}
        <div className="mt-[clamp(12px,2vw,24px)] flex-1 overflow-y-auto pb-10 pr-3 buzz-scroll">

          <div className="
            grid justify-items-center
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            2xl:grid-cols-4
            gap-x-[clamp(16px,2.5vw,50px)]
            gap-y-[clamp(18px,2.8vw,40px)]
            min-w-0
          ">
            {CATEGORIES.map((c) => (
              <CategoryTile
                key={c.key}
                c={c}
                lobbyId={lobbyId}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
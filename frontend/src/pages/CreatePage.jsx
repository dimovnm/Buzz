import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
// import {socket} from "../lib/socket";

import Chat from "../components/Chat";

function generateLobbyCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

import plus from "../assets/plus.png";
import actors from "../../public/themes/createpage/Actors.jpg";
import artists from "../../public/themes/createpage/Artists.jpg";
import athletes from "../../public/themes/createpage/Athletes.jpg";
import historical from "../../public/themes/createpage/Historical.jpg";
import politicians from "../../public/themes/createpage/Politicians.jpg";
import streamers from "../../public/themes/createpage/Streamers.jpg";
import youtubers from "../../public/themes/createpage/Youtubers.png";

const CATEGORIES = [
  { key: "custom", label: "CUSTOM", img: null },
  { key: "actors", label: "ACTORS", img: actors },
  { key: "artists", label: "ARTISTS", img: artists },
  { key: "athletes", label: "ATHLETES", img: athletes },
  { key: "historical", label: "HISTORICAL", img: historical },
  { key: "politicians", label: "POLITICIANS", img: politicians },
  { key: "streamers", label: "STREAMERS", img: streamers },
  { key: "youtubers", label: "YOUTUBERS", img: youtubers },
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
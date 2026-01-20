import React, { useState} from "react";
// import { useNavigate } from "react-router-dom";
// import {socket} from "../lib/socket";
import "./css/CreatePage.css";
import Chat from "../components/Chat";

function generateLobbyCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function CreatePage(){
    const [lobbyId] = useState(() => { // lazy init to remove linter err
        const saved = localStorage.getItem("lobbyId");
        if (saved) return saved;

        const code = generateLobbyCode();
        localStorage.setItem("lobbyId", code);
        return code;
    });

    return(
        <div className="create-page">
            <h1>Code: {lobbyId}</h1>
            <div className="create-chat">
                <Chat/>
            </div>

        </div>

    );
}
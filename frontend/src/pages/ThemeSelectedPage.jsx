// /:code/:themeId
// /:code/custom

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../components/Chat";
import { THEMES } from "../data/themes";
import InfoTooltip from "../components/InfoTooltip";

const MAX_PICKS = 25;
const VETO_COUNTDOWN = 60; // secs

const OppStatus = {
  NOT_CONNECTED: "not_connected",
  CONNECTED_IDLE: "connected_idle",
  SELECTING: "selecting",
  READY: "ready",
};

const Phase = {
  SELECT: "select",
  VETO: "veto",
};

export default function ThemeSelectedPage() {
  const navigate = useNavigate();

  const { themeId } = useParams();
  const theme = THEMES?.[themeId] ?? null;

  const [phase, setPhase] = useState(Phase.SELECT);
  const [countdown, setCountdown] = useState(null);

  const [oppStatus] = useState(OppStatus.NOT_CONNECTED);

  const [userSelected, setUserSelected] = useState(() => new Set());
  const [oppSelected] = useState(() => new Set());
  const [userVeto, setUserVeto] = useState(() => new Set());
  const [oppVeto] = useState(() => new Set());

  const [userReady, setUserReady] = useState(false);
  const [, setOppReady] = useState(false);

  const oppLabel = {
    [OppStatus.NOT_CONNECTED]: "Opponent has not connected...",
    [OppStatus.CONNECTED_IDLE]: "Opponent has connected",
    [OppStatus.SELECTING]: "Opponent is selecting...",
    [OppStatus.READY]: "Opponent is ready",
  }[oppStatus];

  const gridCharacters = useMemo(() => {
    if (!theme) return [];
    if (phase === Phase.SELECT) return theme.characters;
    const poolIds = new Set([...userSelected, ...oppSelected]);
    return theme.characters.filter((c) => poolIds.has(c.id));
  }, [phase, theme, userSelected, oppSelected]);

  useEffect(() => {
    if (countdown === null) return;

    const t = setInterval(() => {
      setCountdown((c) => {
        if (c === null) return null;
        if (c <= 1) return null;
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [countdown]);

  if (!theme) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="text-xl font-bold">Unknown theme: {themeId}</div>
        <button
          className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-semibold"
          onClick={() => navigate("/")}
        >
          Go home
        </button>
      </div>
    );
  }
  
  const userPickCount = userSelected.size;

  const toggleSelect = (id) => {
    if (phase !== Phase.SELECT) return;
    if (userReady) return;

    setUserSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_PICKS) next.add(id);
      return next;
    });
  };

  const toggleVeto = (id) => {
    if (phase !== Phase.VETO) return;
    if (userReady) return;

    setUserVeto((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRandom = () => {
    if (phase !== Phase.SELECT) return;
    if (userReady) return;

    const allIds = theme.characters.map((c) => c.id);

    setUserSelected((prev) => {
      const next = new Set(prev);
      const available = allIds.filter((id) => !next.has(id));
      while (next.size < MAX_PICKS && available.length > 0) {
        const idx = Math.floor(Math.random() * available.length);
        next.add(available[idx]);
        available.splice(idx, 1);
      }
      return next;
    });
  };

  const handleReady = () => {
    if (phase === Phase.SELECT) {
      if (userSelected.size === 0) return;
      setUserReady(true);
      return;
    }

    if (phase === Phase.VETO) {
      setUserReady(true);
      setCountdown((cur) => (cur === null ? VETO_COUNTDOWN : cur));
    }
  };

  const devAdvanceToVeto = () => {
    setPhase(Phase.VETO);
    setUserReady(false);
    setOppReady(false);
    setUserVeto(new Set());
    setCountdown(null);
  };

  const isSelected = (id) => userSelected.has(id);
  const isVetoedByUser = (id) => userVeto.has(id);
  const isVetoedByOpp = (id) => oppVeto.has(id);

  {/* const headerRight =
    phase === Phase.SELECT ? (
      <div className="text-2xl font-extrabold">
        {userPickCount}/{MAX_PICKS}
      </div>
    ) : (
      <div className="text-right">
        <div className="text-sm opacity-70">Veto phase</div>
        <div className="text-xl font-extrabold">
          {countdown === null ? "--" : `${countdown}s`}
        </div>
      </div>
    ); */}

  const canUseVeto = phase === Phase.VETO && !userReady;
  const showTimer = phase === Phase.VETO && (countdown !== null);

  return (
  <div className="h-screen bg-buzzbg text-white overflow-hidden">
    {/* chat */}
    <div className="fixed right-0 top-0 h-screen w-[clamp(280px,26vw,330px)] bg-black/50 z-[2000]">
      <Chat />
    </div>

    {/* left column area */}
    <div className="h-screen pr-[clamp(280px,26vw,330px)]">
      <div className="h-full px-[clamp(16px,4vw,80px)] pt-[clamp(16px,3vw,40px)] flex flex-col">
        {/* header*/}
        <div className="relative">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-0 top-1 text-buzzpanel opacity-80 hover:opacity-100 transition text-3xl"
          >
            {/* replace with icon used in Rules/Join but diff color */}
            ←
          </button>

          {/* title */}
          <div className="flex flex-col items-center text-center">
            <div className="font-luckiest text-buzzpanel text-[clamp(40px,5vw,70px)] leading-none">
              THEME{" "}
              <button
                type="button"
                // later: open a dropdown maybe
                // onClick={() => setThemePickerOpen(true)}
                className="ml-2 inline-flex items-center justify-center rounded-[15px] bg-buzzpanel px-4 py-2 hover:bg-buzzpanel/90 transition"
                title="Change theme"
              >
                <span className="text-buzzbg">{theme.title}</span>
              </button>
            </div>

            <div className="mt-2 font-luckiest text-buzzpanel/80 text-[clamp(18px,2vw,28px)] leading-none">
              {oppLabel}
            </div>

            <div className="mt-2 font-bitter flex items-center justify-center gap-2 text-buzzpanel text-[clamp(14px,1.2vw,18px)]">
              <span>Select up to {MAX_PICKS} characters. Click ready when you are done.</span>
              <InfoTooltip
                text="You and your opponent may each select up to 25 characters. When both players press Ready, the players will be taken to the veto round where the combined pool of characters is trimmed down to 25 total."
              />
            </div>

            {/* counter */}
            <div className="absolute right-0 top-1 font-luckiest text-buzzpanel text-[clamp(22px,2.6vw,40px)] leading-none">
              {userPickCount}/{MAX_PICKS} {/* change to lobby id and place user picks inside of the scroll panel */}
            </div>
          </div>
        </div>

        {/* SCROLL PANEL make like create page where columns for buttons will shrink accordingly*/}
        <div className="mt-[clamp(14px,2vw,22px)] flex-1 overflow-hidden">
          <div className="h-full rounded-[22px] bg-black/25 p-[clamp(14px,1.8vw,22px)] relative">
            <div className="absolute right-5 top-4 font-luckiest text-buzzpanel text-[clamp(22px,2.6vw,40px)] leading-none">
              {userSelected.size}/{MAX_PICKS}
            </div>
            <div className="h-full overflow-y-auto pr-2 buzz-scroll">

              {/* Grid: match your smaller tile vibe */}
              <div className="grid grid-cols-5 gap-x-[clamp(14px,1.6vw,24px)] gap-y-[clamp(14px,1.6vw,22px)]">
                
                {gridCharacters.map((c) => {
                  const selected = isSelected(c.id);
                  const vetoOverlay =
                    phase === Phase.VETO &&
                    (isVetoedByUser(c.id) || isVetoedByOpp(c.id));

                  return (
                    <button
                      key={c.id}
                      onClick={() =>
                        phase === Phase.SELECT ? toggleSelect(c.id) : toggleVeto(c.id)
                      }
                      disabled={userReady}
                      className={[
                        "w-full rounded-[16px] bg-buzzpanel transition relative",
                        "hover:bg-buzzpanel/90",
                        selected && phase === Phase.SELECT ? "ring-4 ring-buzzpanel/60" : "", // make it diff color maybe a slight glow maybe use colors on the lights
                        userReady ? "opacity-70 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      <div className="p-2">
                        <div className="rounded-[12px] overflow-hidden border-2 border-buzzpanel/35 bg-buzzpanel/10">
                          <img
                            src={c.image}
                            alt={c.name}
                            className={[
                              "w-full aspect-square object-cover",
                              vetoOverlay ? "grayscale opacity-40" : "",
                            ].join(" ")}
                          />
                        </div>

                        <div className="mt-2 font-luckiest text-buzzbg text-[clamp(14px,1.2vw,18px)] leading-none truncate">
                          {c.name}
                        </div>
                      </div>

                      {/* Veto overlay */}
                      {phase === Phase.VETO && isVetoedByUser(c.id) && (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-white/90">
                          ✖
                        </div>
                      )}
                      {phase === Phase.VETO && !isVetoedByUser(c.id) && isVetoedByOpp(c.id) && (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-white/50">
                          ✖
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR (Random / Veto / Timer / Ready) be able to deselect random as well */}
        <div className="mt-[clamp(14px,2vw,22px)] pb-[clamp(10px,2vw,18px)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleRandom}
              disabled={phase !== Phase.SELECT || userReady}
              className={[
                "font-luckiest px-6 py-3 rounded-[14px] text-[clamp(18px,2.2vw,30px)] leading-none",
                "bg-buzzpanel/25 border-2 border-buzzpanel/35 hover:bg-buzzpanel/30 transition",
                (phase !== Phase.SELECT || userReady) ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              RANDOM
            </button>

            <button
              // This is your VETO phase button (disabled until phase === VETO)
              disabled={!canUseVeto}
              className={[
                "font-luckiest px-6 py-3 rounded-[14px] text-[clamp(18px,2.2vw,30px)] leading-none",
                "bg-buzzpanel/25 border-2 border-buzzpanel/35 transition",
                canUseVeto ? "hover:bg-buzzpanel/30" : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              onClick={() => {
                // optional: you can make this do nothing and rely on tile clicks,
                // or use it later to "enter veto mode" etc.
              }}
            >
              VETO
            </button>

            {/* timer (hidden unless showTimer) */}
            {showTimer && (
              <div className="font-luckiest text-buzzpanel/70 text-[clamp(18px,2.2vw,30px)] leading-none">
                1:{String(countdown).padStart(2, "0")}
              </div>
            )}
          </div>

          <button
            onClick={handleReady}
            disabled={userReady || (phase === Phase.SELECT && userSelected.size === 0)}
            className={[
              "font-luckiest px-8 py-3 rounded-[14px] text-[clamp(18px,2.2vw,34px)] leading-none",
              "bg-buzzpanel/35 border-2 border-buzzpanel/45 hover:bg-buzzpanel/45 transition",
              (userReady || (phase === Phase.SELECT && userSelected.size === 0))
                ? "opacity-50 cursor-not-allowed"
                : "",
            ].join(" ")}
          >
            READY
          </button>
        </div>

        {/* OPTIONAL DEV BUTTON for now (remove later) */}
        <div className="pb-2">
          <button
            onClick={devAdvanceToVeto}
            className="text-xs opacity-40 hover:opacity-70 transition"
          >
            DEV → VETO
          </button>
        </div>
      </div>
    </div>
  </div>
);

}




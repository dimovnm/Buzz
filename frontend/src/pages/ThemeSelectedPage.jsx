// /:code/:themeId
// /:code/custom

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../components/Chat";
import { THEMES } from "../data/themes";
import InfoTooltip from "../components/InfoTooltip";

import arrowLeftLight from "../assets/arrow-left-light.png";

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

  const [randomAdded, setRandomAdded] = useState(() => new Set());

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
  const oppPickCount = oppSelected.size;
  const totalPickCount = userPickCount + oppPickCount;

  const oppIsReady = oppStatus === OppStatus.READY;
  const needs25Combined = phase === Phase.SELECT && oppIsReady && totalPickCount < 25;

  const toggleSelect = (id) => {
    if (phase !== Phase.SELECT) return;
    if (userReady) return;

    setUserSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_PICKS) next.add(id);
      return next;
    });

    setRandomAdded((prev) => {
      const next = new Set(prev);
      next.delete(id);
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

      randomAdded.forEach((id) => next.delete(id));

      const available = allIds.filter((id) => !next.has(id));
      const newlyAdded = new Set();

      while (next.size < MAX_PICKS && available.length > 0) {
        const idx = Math.floor(Math.random() * available.length);
        const pick = available[idx];
        next.add(pick);
        newlyAdded.add(pick);
        available.splice(idx, 1);
      }

      setRandomAdded(newlyAdded);
      return next;
    });
  };

  const handleReady = () => {
    if (phase === Phase.SELECT) {
      if (userSelected.size === 0) return;
      if (needs25Combined) return;

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
    setRandomAdded(new Set());
  };

  const isSelected = (id) => userSelected.has(id);
  const isOppSelected = (id) => oppSelected.has(id);
  const isVetoedByUser = (id) => userVeto.has(id);
  const isVetoedByOpp = (id) => oppVeto.has(id);

  const canUseVeto = phase === Phase.VETO && !userReady;
  const showTimer = phase === Phase.VETO && countdown !== null;

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
              className="absolute left-0 top-1 hover:opacity-90 transition"
            >
              <img src={arrowLeftLight} alt="Back" className="w-10 h-10 object-contain" />
            </button>

            {/* title */}
            <div className="flex flex-col items-center text-center">
              <div className="font-luckiest text-buzzpanel text-[clamp(40px,5vw,70px)] leading-none">
                THEME{" "}
                <button
                  type="button"
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
                  text="You and your opponent may each select up to 25 characters. When both players press Ready, you’ll enter the veto round where the combined pool is trimmed down to 25 total."
                />
              </div>
            </div>
          </div>

          {/* PANEL */}
          <div className="mt-[clamp(14px,2vw,22px)] flex-1 overflow-hidden min-w-0">
            <div className="h-full rounded-[22px] bg-black/25 p-[clamp(14px,1.8vw,22px)] relative min-w-0">
              <div className="absolute left-0 right-0 top-0 px-[clamp(14px,1.8vw,22px)] pt-3">
                <div className="flex items-start justify-between">
                  {/* YOU (left) */}
                  <div className="text-left">
                    <div className="font-luckiest text-buzzpanel text-[clamp(16px,1.6vw,22px)] leading-none">
                      YOU
                    </div>
                    <div className="font-luckiest text-buzzpanel text-[clamp(22px,2.6vw,40px)] leading-none">
                      {userPickCount}/{MAX_PICKS}
                    </div>
                  </div>

                  {/* OPP (right) */}
                  <div className="text-right">
                    <div
                      className="font-luckiest text-buzzpanel/50 text-[clamp(16px,1.6vw,22px)] leading-none"
                    >
                      OPP
                    </div>
                    <div
                      className="font-luckiest text-buzzpanel/50 text-[clamp(22px,2.6vw,40px)] leading-none"
                    >
                      {oppPickCount}/{MAX_PICKS}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-full overflow-y-auto pr-2 buzz-scroll pt-[74px] min-w-0">
                <div
                  className="
                    grid justify-items-center min-w-0
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    2xl:grid-cols-5
                    gap-x-[clamp(14px,1.6vw,20px)]
                    gap-y-[clamp(12px,1.3vw,18px)]
                  "
                >
                  {gridCharacters.map((c) => {
                    const userHas = isSelected(c.id);
                    const oppHas = isOppSelected(c.id);

                    const vetoOverlay =
                      phase === Phase.VETO &&
                      (isVetoedByUser(c.id) || isVetoedByOpp(c.id));

                    const ringClass =
                      userHas && oppHas
                        ? "ring-4 ring-white"
                        : userHas
                        ? "ring-4 ring-buzzpanel/60"
                        : oppHas
                        ? "ring-4 ring-[#4087C5]"
                        : "";

                    return (
                      <button
                        key={c.id}
                        onClick={() =>
                          phase === Phase.SELECT ? toggleSelect(c.id) : toggleVeto(c.id)
                        }
                        disabled={userReady}
                        className={[
                          "text-center min-w-0 w-full max-w-[170px] rounded-[15px] bg-buzzpanel shadow-buzz transition relative",
                          "hover:bg-buzzpanel/90",
                          ringClass,
                          userReady ? "opacity-70 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        <div className="p-[10px]">
                          <img
                            src={c.image}
                            alt={c.name}
                            className={[
                              "mx-auto w-[137px] h-[116px] rounded-[12px] object-cover",
                              vetoOverlay ? "grayscale opacity-40" : "",
                            ].join(" ")}
                          />

                          <div className="mt-1 font-luckiest text-[clamp(16px,1.8vw,22px)] text-buzzbg leading-none truncate">
                            {c.name}
                          </div>
                        </div>

                        {phase === Phase.VETO && isVetoedByUser(c.id) && (
                          <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-white/90">
                            ✖
                          </div>
                        )}
                        {phase === Phase.VETO &&
                          !isVetoedByUser(c.id) &&
                          isVetoedByOpp(c.id) && (
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

          {/* BOTTOM BAR */}
          <div className="mt-[clamp(14px,2vw,22px)] pb-[clamp(10px,2vw,18px)] flex items-center justify-between min-w-0">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={handleRandom}
                disabled={phase !== Phase.SELECT || userReady}
                className={[
                  "font-luckiest px-6 py-3 rounded-[14px] text-[clamp(18px,2.2vw,30px)] leading-none whitespace-nowrap",
                  "bg-buzzpanel/25 border-2 border-buzzpanel/35 hover:bg-buzzpanel/30 transition",
                  phase !== Phase.SELECT || userReady ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                RANDOM
              </button>

              <button
                disabled={!canUseVeto}
                className={[
                  "font-luckiest px-6 py-3 rounded-[14px] text-[clamp(18px,2.2vw,30px)] leading-none whitespace-nowrap",
                  "bg-buzzpanel/25 border-2 border-buzzpanel/35 transition",
                  canUseVeto ? "hover:bg-buzzpanel/30" : "opacity-40 cursor-not-allowed",
                ].join(" ")}
              >
                VETO
              </button>

              <div className="min-w-0">
                {needs25Combined ? (
                  <div className="font-luckiest text-buzzpanel/70 text-[clamp(14px,1.6vw,22px)] leading-none">
                    At least 25 characters must be selected between the two of you
                  </div>
                ) : showTimer ? (
                  <div className="font-luckiest text-buzzpanel/70 text-[clamp(18px,2.2vw,30px)] leading-none whitespace-nowrap">
                    1:{String(countdown).padStart(2, "0")}
                  </div>
                ) : null}
              </div>
            </div>

            <button
              onClick={handleReady}
              disabled={
                userReady ||
                (phase === Phase.SELECT && userSelected.size === 0) ||
                needs25Combined
              }
              className={[
                "font-luckiest px-8 py-3 rounded-[14px] text-[clamp(18px,2.2vw,34px)] leading-none whitespace-nowrap",
                "bg-buzzpanel/35 border-2 border-buzzpanel/45 hover:bg-buzzpanel/45 transition",
                userReady ||
                (phase === Phase.SELECT && userSelected.size === 0) ||
                needs25Combined
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

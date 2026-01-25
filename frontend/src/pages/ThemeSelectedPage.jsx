// /:code/:themeId
// /:code/custom

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../components/Chat";
import { THEMES } from "../data/themes";

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
    [OppStatus.NOT_CONNECTED]: "Opponent has not connected.",
    [OppStatus.CONNECTED_IDLE]: "Opponent has connected.",
    [OppStatus.SELECTING]: "Opponent is selecting...",
    [OppStatus.READY]: "Opponent is ready.",
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

  const headerRight =
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
    );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                className="text-2xl opacity-70 hover:opacity-100 transition"
                onClick={() => navigate(-1)}
                aria-label="Back"
              >
                {"<"}
              </button>

              <div className="text-3xl font-extrabold">
                THEME{" "}
                <span className="px-3 py-1 rounded-2xl bg-white/10">
                  {theme.title}
                </span>
              </div>
            </div>

            <div className="mt-2 text-sm opacity-70">{oppLabel}</div>

            {phase === Phase.SELECT && (
              <div className="mt-1 text-sm opacity-50">
                Select up to {MAX_PICKS} characters. Click ready when you are done.
              </div>
            )}

            {phase === Phase.VETO && (
              <div className="mt-1 text-sm opacity-50">
                Veto phase: click to mark removals from the combined pool.
              </div>
            )}
          </div>

          {headerRight}
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6">
        <div className="h-full overflow-y-auto rounded-2xl bg-white/5 p-4">
          <div className="grid grid-cols-5 gap-4">
            {gridCharacters.map((c) => {
              const selected = isSelected(c.id);
              const showSelectedStyle = phase === Phase.SELECT && selected;

              const vetoOverlay =
                phase === Phase.VETO &&
                (isVetoedByUser(c.id) || isVetoedByOpp(c.id));

              return (
                <button
                  key={c.id}
                  onClick={() =>
                    phase === Phase.SELECT ? toggleSelect(c.id) : toggleVeto(c.id)
                  }
                  className={[
                    "relative rounded-xl p-2 text-left transition",
                    "bg-white/5 hover:bg-white/10",
                    showSelectedStyle
                      ? "ring-2 ring-white scale-[1.02]"
                      : "ring-1 ring-white/10",
                    userReady ? "opacity-80 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className={[
                      "w-full aspect-square object-cover rounded-lg",
                      vetoOverlay ? "grayscale opacity-40" : "",
                    ].join(" ")}
                  />

                  <div className="mt-2 text-sm opacity-80 truncate">{c.name}</div>

                  {phase === Phase.VETO && isVetoedByUser(c.id) && (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-black">
                      X
                    </div>
                  )}

                  {phase === Phase.VETO &&
                    !isVetoedByUser(c.id) &&
                    isVetoedByOpp(c.id) && (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl font-black opacity-60">
                        X
                      </div>
                    )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition disabled:opacity-50"
            onClick={handleRandom}
            disabled={phase !== Phase.SELECT || userReady}
          >
            RANDOM
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition disabled:opacity-50"
            onClick={() => {
              if (phase === Phase.SELECT) setUserSelected(new Set());
              if (phase === Phase.VETO) setUserVeto(new Set());
            }}
            disabled={userReady}
          >
            {phase === Phase.SELECT ? "CLEAR" : "CLEAR VETO"}
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
            onClick={devAdvanceToVeto}
            title="Dev only: switch to veto phase"
          >
            DEV -`{">"}` VETO
          </button>
        </div>

        <button
          className={[
            "px-7 py-3 rounded-xl font-extrabold transition",
            userReady
              ? "bg-white/40 text-black cursor-not-allowed"
              : "bg-white text-black hover:scale-[1.02]",
          ].join(" ")}
          onClick={handleReady}
          disabled={userReady}
        >
          READY
        </button>
      </div>

      <Chat />
    </div>
  );
}




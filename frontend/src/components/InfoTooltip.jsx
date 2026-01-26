import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function InfoTooltip({ text }) {
  const iconRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePos = () => {
    const el = iconRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: r.bottom + 10,
      left: r.left + r.width / 2,
    });
  };

  useEffect(() => {
    if (!open) return;
    updatePos();
    const onScroll = () => updatePos();
    const onResize = () => updatePos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <span
        ref={iconRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-buzzpanel/40 text-buzzpanel/70 text-xs cursor-default"
      >
        i
      </span>

      {open &&
        createPortal(
          <div
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[99999] -translate-x-1/2 w-[320px] font-bitter rounded-xl bg-black/85 p-3 text-xs text-white shadow-lg pointer-events-none"
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}

import "./Lights.css";

const COLORS = [
  "theme-color-one",
  "theme-color-two",
  "theme-color-three",
  "theme-color-four",
  "theme-color-five",
  "theme-color-six",
  "theme-color-seven",
  "theme-color-eight",
];

export default function Lights({
  count = 28,          // number of bulbs across
  fixed = true,        // stick to top of screen
  height = 90,         // reserved vertical space (px) if fixed
}) {
  const bulbs = Array.from({ length: count }, (_, i) => COLORS[i % COLORS.length]);

  return (
    <>
      {fixed && <div style={{ height }} aria-hidden="true" />}
      <div className={`lights-wrap ${fixed ? "is-fixed" : ""}`} aria-hidden="true">
        <div className="light-bulbs">
          {bulbs.map((cls, i) => (
            <span
              key={i}
              className={`light-bulb ${cls}`}
              style={{
                // staggers the animation so they don't pulse all at once
                animationDelay: `${(i % 8) * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

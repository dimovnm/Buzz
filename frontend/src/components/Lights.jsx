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
  count = 12,          // num of bulbs
  fixed = true,
  height = 90,
}) {
  const bulbs = Array.from({ length: count }, (_, i) => COLORS[i % COLORS.length]);

  return (
    <>
      {fixed && <div style={{ height }} aria-hidden="true" />}
      <div className={`lights-wrap ${fixed ? "is-fixed" : ""}`} aria-hidden="true">
        <div
          className="light-bulbs"
          style={{ "--strand-count": count }}
        >
          {bulbs.map((cls, i) => (
            <span
              key={i}
              className={`light-bulb ${cls}`}
              style={{
                animationDelay: `${(i % 8) * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

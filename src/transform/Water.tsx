import { Img, random, staticFile } from "remotion";
import { HEIGHT, WIDTH } from "../constants";

/** Flood/sea surface from `top` down to the bottom of frame, with reflection and moving wave rows. */
export const Water: React.FC<{ top: number; frame: number }> = ({ top, frame }) => {
  const h = HEIGHT - top;
  if (h <= 0) return null;
  const rows = 28;
  return (
    <div style={{ position: "absolute", left: 0, top, width: WIDTH, height: h, overflow: "hidden" }}>
      {/* mirrored reflection of the shore */}
      <Img
        src={staticFile("vfx/clean-plate.jpg")}
        style={{
          position: "absolute",
          left: 0,
          top: top - HEIGHT,
          width: WIDTH,
          height: HEIGHT,
          transform: `scaleY(-1) translateX(${Math.sin(frame / 10) * 4}px)`,
          filter: "blur(5px) brightness(0.9) saturate(0.9)",
          opacity: 0.55,
        }}
      />
      {/* water body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(90,175,195,0.45) 0%, rgba(25,110,150,0.78) 22%, rgba(12,72,110,0.92) 60%, rgba(6,45,78,0.97) 100%)",
        }}
      />
      {/* wave rows, denser near the horizon for perspective */}
      {new Array(rows).fill(0).map((_, i) => {
        const d = (i + 1) / rows;
        const y = h * Math.pow(d, 1.8) + Math.sin(frame / 8 + i * 1.7) * d * 6;
        const thick = 2 + d * 12;
        const dash = 18 + d * 140;
        const gap = dash * (1.4 + random(`wg-${i}`));
        const dir = i % 2 === 0 ? 1 : -1;
        const off = frame * (0.6 + d * 5) * dir + random(`wo-${i}`) * 1000;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -50,
              width: WIDTH + 100,
              top: y,
              height: thick,
              borderRadius: thick,
              opacity: 0.08 + 0.22 * d,
              backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.95) 0 ${dash}px, rgba(255,255,255,0) ${dash}px ${dash + gap}px)`,
              backgroundPositionX: off,
              filter: `blur(${0.5 + d * 1.5}px)`,
            }}
          />
        );
      })}
      {/* shoreline foam + horizon shimmer */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -4,
          width: WIDTH,
          height: 14,
          background: "linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.85), rgba(255,255,255,0))",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
};

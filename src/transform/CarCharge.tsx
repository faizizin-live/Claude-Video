import { AbsoluteFill, Img, interpolate, random, staticFile } from "remotion";
import { CAR, T } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Radial energy glow on the car while the footage is still rolling (CHARGE -> FREEZE). */
export const ChargeGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const p = interpolate(frame, [T.CHARGE, T.FLASH], [0, 1], clamp);
  const pulse = 0.75 + 0.25 * Math.sin(frame * 1.1);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 520px 480px at ${CAR.cx}px ${CAR.cy}px, rgba(34,211,238,${0.45 * p * pulse}) 0%, rgba(255,214,10,${0.25 * p}) 40%, rgba(0,0,0,0) 75%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

/** Frozen car cut-out that glows white-hot, squashes and crackles before the flash. */
export const CarCharge: React.FC<{ frame: number }> = ({ frame }) => {
  const p = interpolate(frame, [T.FREEZE, T.FLASH], [0, 1], clamp);
  const squash = 1 + Math.sin(frame * 1.4) * 0.035 * p;
  const brightness = 1 + Math.pow(p, 2) * 5;
  const step = Math.floor(frame / 2);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("vfx/car-cutout.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transformOrigin: `${CAR.cx}px ${CAR.y1}px`,
          transform: `scale(${1 / squash}, ${squash}) translateY(${-p * 30}px)`,
          filter: `brightness(${brightness}) drop-shadow(0 0 ${12 + 40 * p}px rgba(255,255,255,0.95)) drop-shadow(0 0 ${20 + 70 * p}px rgba(34,211,238,0.9))`,
        }}
      />
      {/* contracting energy rings */}
      {[0, 1, 2].map((k) => {
        const rp = ((frame - T.FREEZE) / 14 + k / 3) % 1;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: CAR.cx,
              top: CAR.cy,
              width: 900 * (1 - rp),
              height: 700 * (1 - rp),
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `${6 + 8 * rp}px solid rgba(255,214,10,${0.8 * rp})`,
              boxShadow: `0 0 30px rgba(34,211,238,${0.8 * rp})`,
            }}
          />
        );
      })}
      {/* electric sparks */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {new Array(9).fill(0).map((_, i) => {
          const sx = CAR.x0 + random(`spx-${step}-${i}`) * (CAR.x1 - CAR.x0);
          const sy = CAR.y0 + random(`spy-${step}-${i}`) * (CAR.y1 - CAR.y0);
          const pts = [[sx, sy]];
          for (let j = 1; j < 6; j++) {
            pts.push([
              pts[j - 1][0] + (random(`sjx-${step}-${i}-${j}`) - 0.5) * 90,
              pts[j - 1][1] + (random(`sjy-${step}-${i}-${j}`) - 0.5) * 90,
            ]);
          }
          const d = pts.map((q, j) => `${j === 0 ? "M" : "L"}${q[0]} ${q[1]}`).join(" ");
          return (
            <g key={i} opacity={random(`spo-${step}-${i}`) < 0.35 + 0.5 * p ? 1 : 0}>
              <path d={d} stroke="#22D3EE" strokeWidth={10} fill="none" opacity={0.5} strokeLinejoin="round" />
              <path d={d} stroke="#ffffff" strokeWidth={3.5} fill="none" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

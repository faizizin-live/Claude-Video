import { interpolate, random, useCurrentFrame } from "remotion";
import { SAFE_BOX } from "../constants";
import { EMOJI } from "../fonts";

/** Emojis floating upward inside the safe zone. Use inside a <Sequence>. */
export const EmojiBurst: React.FC<{ emojis: string[]; count?: number; seed?: string; originY?: number }> = ({
  emojis,
  count = 10,
  seed = "burst",
  originY = SAFE_BOX.bottomY - 280,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const delay = Math.floor(random(`${seed}-d-${i}`) * 20);
        const f = frame - delay;
        if (f < 0) return null;
        const life = 55;
        const p = Math.min(1, f / life);
        const x = SAFE_BOX.x + 60 + random(`${seed}-x-${i}`) * (SAFE_BOX.width - 120);
        const rise = 380 + random(`${seed}-r-${i}`) * 320;
        const sway = Math.sin((f + i * 10) / 8) * 26;
        const size = 70 + random(`${seed}-s-${i}`) * 60;
        const o = interpolate(p, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: originY - p * rise,
              fontFamily: EMOJI,
              fontSize: size,
              opacity: o,
              transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 0.2], [0.3, 1], { extrapolateRight: "clamp" })}) rotate(${sway}deg)`,
            }}
          >
            {emojis[i % emojis.length]}
          </span>
        );
      })}
    </>
  );
};

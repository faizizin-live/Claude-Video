import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE_BOX } from "../constants";
import { anton } from "../fonts";

/** Glitchy "TRANSFORM!" slam during the charge-up. Use inside a <Sequence>. */
export const TransformTitle: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 7, stiffness: 220 } });
  const out = interpolate(frame, [durationInFrames - 4, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jx = (random(`tx-${frame}`) - 0.5) * 16;
  const jy = (random(`ty-${frame}`) - 0.5) * 10;
  const split = 6 + 10 * random(`ts-${Math.floor(frame / 2)}`);
  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    fontFamily: anton,
    fontSize: 132,
    lineHeight: 1,
    textAlign: "center",
  };
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        width: SAFE_BOX.width,
        top: SAFE_BOX.y + 150,
        height: 150,
        transform: `translate(${jx}px, ${jy}px) scale(${(0.4 + 0.6 * s) * out}) rotate(-4deg)`,
      }}
    >
      <div style={{ ...base, color: COLORS.cyan, transform: `translateX(${-split}px)`, mixBlendMode: "screen", opacity: 0.9 }}>
        TRANSFORM!
      </div>
      <div style={{ ...base, color: COLORS.pink, transform: `translateX(${split}px)`, mixBlendMode: "screen", opacity: 0.9 }}>
        TRANSFORM!
      </div>
      <div
        style={{
          ...base,
          color: COLORS.yellow,
          WebkitTextStroke: `9px ${COLORS.ink}`,
          paintOrder: "stroke fill",
          textShadow: "0 12px 30px rgba(0,0,0,0.6)",
        }}
      >
        TRANSFORM!
      </div>
    </div>
  );
};

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE_BOX } from "../constants";
import { anton, EMOJI, montserrat } from "../fonts";

/** Opening hook: big kinetic title in the upper part of the safe zone. */
export const HookTitle: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = "VELFIRE";

  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boxIn = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 140 } });
  const subIn = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const van = spring({ frame: frame - 6, fps, config: { damping: 10, stiffness: 120 } });

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        top: SAFE_BOX.y + 70,
        width: SAFE_BOX.width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateX(${exit * -1100}px)`,
        opacity: 1 - exit * 0.3,
      }}
    >
      <div style={{ display: "flex" }}>
        {word.split("").map((ch, i) => {
          const s = spring({ frame: frame - i * 2, fps, config: { damping: 11, stiffness: 160 } });
          return (
            <span
              key={i}
              style={{
                fontFamily: anton,
                fontSize: 190,
                lineHeight: 1,
                color: COLORS.white,
                WebkitTextStroke: `8px ${COLORS.ink}`,
                paintOrder: "stroke fill",
                textShadow: "0 12px 30px rgba(0,0,0,0.55)",
                display: "inline-block",
                transform: `translateY(${(1 - s) * 160}px) scale(${0.6 + s * 0.4})`,
                opacity: s,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 6,
          background: COLORS.yellow,
          color: COLORS.ink,
          fontFamily: montserrat,
          fontWeight: 900,
          fontSize: 76,
          padding: "6px 34px",
          borderRadius: 18,
          transform: `rotate(-3deg) scale(${boxIn})`,
          boxShadow: "0 10px 0 rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        DRIVE OUT
        <span
          style={{
            fontFamily: EMOJI,
            display: "inline-block",
            transform: `translateX(${(1 - van) * -60}px)`,
          }}
        >
          🚐
        </span>
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: montserrat,
          fontWeight: 800,
          fontSize: 44,
          color: COLORS.white,
          textShadow: "0 3px 10px rgba(0,0,0,0.8)",
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 30}px)`,
        }}
      >
        Hari ni kita gerak! ✨
      </div>
    </div>
  );
};

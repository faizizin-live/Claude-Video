import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE_BOX } from "../constants";
import { anton, EMOJI, montserrat } from "../fonts";

/** Closing title in the upper-middle of the safe zone (the car is at the bottom of frame). */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, config: { damping: 11, stiffness: 150 } });
  const b = spring({ frame: frame - 8, fps, config: { damping: 11, stiffness: 150 } });
  const c = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const underline = interpolate(frame, [12, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line: React.CSSProperties = {
    fontFamily: anton,
    fontSize: 170,
    lineHeight: 0.95,
    color: COLORS.white,
    WebkitTextStroke: `9px ${COLORS.ink}`,
    paintOrder: "stroke fill",
    textShadow: "0 12px 30px rgba(0,0,0,0.6)",
  };

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        top: SAFE_BOX.y + 60,
        width: SAFE_BOX.width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ ...line, transform: `translateY(${(1 - a) * -200}px)`, opacity: a }}>SELAMAT</div>
      <div style={{ ...line, color: COLORS.yellow, transform: `scale(${b})` }}>JALAN!</div>
      <div
        style={{
          height: 12,
          width: 520 * underline,
          background: COLORS.pink,
          borderRadius: 10,
          marginTop: 10,
          boxShadow: "0 6px 0 rgba(0,0,0,0.35)",
        }}
      />
      <div
        style={{
          marginTop: 30,
          fontFamily: montserrat,
          fontWeight: 800,
          fontSize: 50,
          color: COLORS.white,
          textShadow: "0 3px 10px rgba(0,0,0,0.85)",
          opacity: c,
          transform: `translateY(${(1 - c) * 40}px)`,
        }}
      >
        Hati-hati di jalan <span style={{ fontFamily: EMOJI }}>🤲</span>
      </div>
    </div>
  );
};

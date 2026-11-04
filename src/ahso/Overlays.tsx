import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE_BOX } from "../constants";
import { anton, EMOJI, montserrat } from "../fonts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Opening hook (upper safe zone). Use inside a <Sequence>. */
export const Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], clamp);
  const l1 = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  const l2 = spring({ frame: frame - 7, fps, config: { damping: 10, stiffness: 150 } });
  const sub = spring({ frame: frame - 16, fps, config: { damping: 14 } });
  const env = spring({ frame: frame - 4, fps, config: { damping: 7, stiffness: 120 } });

  const big: React.CSSProperties = {
    fontFamily: anton,
    fontSize: 150,
    lineHeight: 1,
    color: COLORS.white,
    WebkitTextStroke: `8px ${COLORS.ink}`,
    paintOrder: "stroke fill",
    textShadow: "0 12px 30px rgba(0,0,0,0.55)",
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
        transform: `translateY(${exit * -500}px)`,
        opacity: 1 - exit,
      }}
    >
      <div style={{ ...big, transform: `translateY(${(1 - l1) * -120}px)`, opacity: l1 }}>BACA MESEJ</div>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: COLORS.pink,
          color: COLORS.white,
          fontFamily: montserrat,
          fontWeight: 900,
          fontSize: 82,
          padding: "6px 34px",
          borderRadius: 20,
          border: `6px solid ${COLORS.ink}`,
          boxShadow: "0 10px 0 rgba(0,0,0,0.35)",
          transform: `rotate(-3deg) scale(${l2})`,
        }}
      >
        DARI AHSO
        <span style={{ fontFamily: EMOJI, display: "inline-block", transform: `rotate(${(1 - env) * -40}deg) scale(${env})` }}>
          💌
        </span>
      </div>
      <div
        style={{
          marginTop: 26,
          fontFamily: montserrat,
          fontWeight: 800,
          fontSize: 44,
          color: COLORS.white,
          textShadow: "0 3px 10px rgba(0,0,0,0.85)",
          opacity: sub,
          transform: `translateY(${(1 - sub) * 30}px)`,
        }}
      >
        Tonton sampai habis <span style={{ fontFamily: EMOJI }}>🥹</span>
      </div>
    </div>
  );
};

/** "Makan atau puasa?" poll card – mid/lower safe zone, under Yaya's face and above the captions. */
export const Poll: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const leave = spring({ frame: frame - (durationInFrames - 10), fps, config: { damping: 18, stiffness: 200 } });
  // the "votes" swing back and forth – nobody can decide
  const swing = 0.5 + 0.28 * Math.sin(frame / 14);
  const opts = [
    { emoji: "🍽️", label: "MAKAN", p: swing, color: COLORS.yellow },
    { emoji: "🌙", label: "PUASA", p: 1 - swing, color: COLORS.cyan },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x + 70,
        top: SAFE_BOX.bottomY - 300 - 330,
        width: SAFE_BOX.width - 140,
        background: "rgba(255,255,255,0.96)",
        border: `6px solid ${COLORS.ink}`,
        borderRadius: 36,
        boxShadow: "0 14px 0 rgba(0,0,0,0.35)",
        padding: "26px 32px 30px",
        boxSizing: "border-box",
        transform: `scale(${enter * (1 - leave)}) rotate(${-2 + Math.sin(frame / 20)}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <div style={{ fontFamily: montserrat, fontWeight: 900, fontSize: 50, color: COLORS.ink, textAlign: "center", marginBottom: 18 }}>
        HARI NI NAK... <span style={{ fontFamily: EMOJI }}>🤔</span>
      </div>
      {opts.map((o, i) => {
        const grow = spring({ frame: frame - 8 - i * 5, fps, config: { damping: 16 } });
        return (
          <div
            key={o.label}
            style={{
              position: "relative",
              height: 84,
              borderRadius: 999,
              border: `5px solid ${COLORS.ink}`,
              overflow: "hidden",
              marginTop: i ? 16 : 0,
              background: "#F3F4F6",
            }}
          >
            <div style={{ position: "absolute", inset: 0, width: `${o.p * 100 * grow}%`, background: o.color }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 28px",
                fontFamily: montserrat,
                fontWeight: 900,
                fontSize: 44,
                color: COLORS.ink,
              }}
            >
              <span>
                <span style={{ fontFamily: EMOJI }}>{o.emoji}</span> {o.label}
              </span>
              <span>{Math.round(o.p * 100 * grow)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Closing card. Use inside a <Sequence>. */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, config: { damping: 11, stiffness: 150 } });
  const b = spring({ frame: frame - 8, fps, config: { damping: 10, stiffness: 150 } });
  const c = spring({ frame: frame - 20, fps, config: { damping: 14 } });
  const beat = 1 + 0.08 * Math.max(0, Math.sin(frame / 5));
  const line: React.CSSProperties = {
    fontFamily: anton,
    fontSize: 150,
    lineHeight: 0.98,
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
        top: SAFE_BOX.y + 90,
        width: SAFE_BOX.width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ ...line, transform: `translateY(${(1 - a) * -200}px)`, opacity: a }}>TERIMA KASIH</div>
      <div style={{ ...line, color: COLORS.yellow, display: "flex", alignItems: "center", gap: 20, transform: `scale(${b})` }}>
        AHSO
        <span style={{ fontFamily: EMOJI, fontSize: 120, WebkitTextStroke: "0", display: "inline-block", transform: `scale(${beat})` }}>
          💛
        </span>
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: montserrat,
          fontWeight: 800,
          fontSize: 48,
          color: COLORS.white,
          background: "rgba(11,11,15,0.65)",
          padding: "12px 30px",
          borderRadius: 999,
          opacity: c,
          transform: `translateY(${(1 - c) * 40}px)`,
        }}
      >
        Doakan cepat sembuh <span style={{ fontFamily: EMOJI }}>🤲</span>
      </div>
    </div>
  );
};

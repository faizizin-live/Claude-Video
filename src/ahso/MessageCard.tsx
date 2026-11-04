import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE_BOX } from "../constants";
import { EMOJI, montserrat } from "../fonts";
import { MESSAGE, MESSAGE_IN, MESSAGE_OUT, WORDS, at, srcTime } from "./timeline";

const CARD_H = 420;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Chat-bubble card that shows the message from Ahso sentence by sentence,
 * karaoke-highlighting each word as it is read aloud.
 * Sits on the bottom edge of the safe zone (over his torso, clear of his face).
 */
export const MessageCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = srcTime(frame);

  const inF = at(MESSAGE_IN);
  const outF = at(MESSAGE_OUT);
  if (frame < inF || frame > outF + 15) return null;

  const enter = spring({ frame: frame - inF, fps, config: { damping: 13, stiffness: 140 } });
  const leave = spring({ frame: frame - outF, fps, config: { damping: 18, stiffness: 160 } });

  // current sentence = last one whose first word has started (first one before that)
  let idx = 0;
  MESSAGE.forEach((m, i) => {
    if (t >= WORDS[m.from].s - 0.15) idx = i;
  });
  const sentence = MESSAGE[idx];
  const sentenceStartF = at(WORDS[sentence.from].s - 0.15);
  const swap = spring({ frame: frame - sentenceStartF, fps, config: { damping: 15, stiffness: 200 } });

  const display = sentence.text.split(" ");
  const progress = (idx + 1) / MESSAGE.length;

  // little "typing…" dots before the first sentence
  const typing = t < WORDS[MESSAGE[0].from].s - 0.15;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        width: SAFE_BOX.width,
        top: SAFE_BOX.bottomY - CARD_H - 10,
        height: CARD_H,
        transform: `translateY(${(1 - enter) * 520 + leave * 620}px) rotate(${(1 - enter) * 6}deg)`,
        opacity: interpolate(leave, [0, 1], [1, 0], clamp),
      }}
    >
      {/* header pill */}
      <div
        style={{
          position: "absolute",
          left: 26,
          top: -44,
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: COLORS.ink,
          color: COLORS.white,
          fontFamily: montserrat,
          fontWeight: 900,
          fontSize: 38,
          padding: "10px 26px 10px 12px",
          borderRadius: 999,
          border: `4px solid ${COLORS.white}`,
          boxShadow: "0 8px 0 rgba(0,0,0,0.35)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.pink})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            color: COLORS.ink,
          }}
        >
          A
        </div>
        Ahso
        <span style={{ fontFamily: EMOJI, fontSize: 34 }}>💌</span>
      </div>

      {/* bubble */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.96)",
          borderRadius: 44,
          borderBottomLeftRadius: 10,
          border: `6px solid ${COLORS.ink}`,
          boxShadow: "0 16px 0 rgba(0,0,0,0.35), 0 24px 60px rgba(0,0,0,0.35)",
          padding: "62px 44px 34px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {typing ? (
          <div style={{ display: "flex", gap: 18, marginTop: 70, marginLeft: 10 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 99,
                  background: "#9CA3AF",
                  transform: `translateY(${Math.sin((frame - i * 5) / 4) * 10}px)`,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              fontFamily: montserrat,
              fontWeight: 800,
              fontSize: sentence.to - sentence.from > 10 ? 54 : 62,
              lineHeight: 1.22,
              color: COLORS.ink,
              display: "flex",
              flexWrap: "wrap",
              columnGap: 16,
              rowGap: 6,
              transform: `translateY(${(1 - swap) * 60}px)`,
              opacity: swap,
            }}
          >
            {display.map((txt, i) => {
              const wd = WORDS[sentence.from + i];
              const said = t >= wd.s;
              const active = said && t < wd.e + 0.05;
              return (
                <span
                  key={i}
                  style={{
                    opacity: said ? 1 : 0.28,
                    background: active ? COLORS.yellow : "transparent",
                    borderRadius: 12,
                    padding: "0 6px",
                    margin: "0 -6px",
                    transform: `scale(${active ? 1.06 : 1})`,
                    display: "inline-block",
                  }}
                >
                  {txt}
                </span>
              );
            })}
          </div>
        )}

        {/* read progress */}
        <div
          style={{
            position: "absolute",
            left: 44,
            right: 44,
            bottom: 26,
            height: 8,
            borderRadius: 8,
            background: "rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              borderRadius: 8,
              background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.pink})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

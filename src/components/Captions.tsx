import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE_BOX } from "../constants";
import { anton } from "../fonts";
import transcript from "../data/transcript.json";

type Word = { w: string; s: number; e: number };

/**
 * TikTok-style word-by-word captions driven by data/transcript.json.
 * Sits just above the bottom edge of the safe zone so it never collides
 * with the platform caption/music UI.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const seg = transcript.segments.find((s) => t >= s.start - 0.1 && t <= s.end + 0.5);
  if (!seg) return null;

  const words = seg.words as Word[];
  const segEndFrame = Math.round((seg.end + 0.5) * fps);
  const out = spring({ frame: frame - (segEndFrame - 8), fps, config: { damping: 20, stiffness: 220 } });

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        width: SAFE_BOX.width,
        top: SAFE_BOX.bottomY - 260,
        height: 220,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 24,
        transform: `scale(${1 - out})`,
      }}
    >
      {words.map((wd, i) => {
        const startF = Math.round(wd.s * fps);
        const active = t >= wd.s && t < wd.e;
        const shown = frame >= startF;
        const pop = spring({ frame: frame - startF, fps, config: { damping: 8, stiffness: 220 } });
        return (
          <span
            key={i}
            style={{
              fontFamily: anton,
              fontSize: 150,
              lineHeight: 1.05,
              color: active ? COLORS.yellow : COLORS.white,
              WebkitTextStroke: `10px ${COLORS.ink}`,
              paintOrder: "stroke fill",
              textShadow: "0 10px 24px rgba(0,0,0,0.6)",
              display: "inline-block",
              opacity: shown ? 1 : 0,
              transform: `scale(${shown ? 0.5 + pop * 0.5 : 0.5}) rotate(${active ? -3 : 0}deg)`,
            }}
          >
            {wd.w}
          </span>
        );
      })}
    </div>
  );
};

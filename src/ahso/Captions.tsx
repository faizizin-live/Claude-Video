import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE_BOX } from "../constants";
import { anton } from "../fonts";
import { CAPTION_PAGES, WORDS, at, srcTime } from "./timeline";

/**
 * Word-by-word pop captions (TikTok style) for the spoken lines after the message.
 * Max ~5 words per page, sitting just above the bottom safe-zone edge.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = srcTime(frame);

  const pageIdx = CAPTION_PAGES.findIndex(([a, b], i) => {
    const start = WORDS[a].s - 0.1;
    const next = CAPTION_PAGES[i + 1];
    const end = Math.min(WORDS[b].e + 0.7, next ? WORDS[next[0]].s - 0.1 : Infinity);
    return t >= start && t < end;
  });
  if (pageIdx < 0) return null;

  const [a, b] = CAPTION_PAGES[pageIdx];
  const words = WORDS.slice(a, b + 1);

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        width: SAFE_BOX.width,
        top: SAFE_BOX.bottomY - 300,
        height: 280,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexWrap: "wrap",
        columnGap: 24,
      }}
    >
      {words.map((wd, i) => {
        const startF = at(wd.s);
        const shown = frame >= startF;
        const active = t >= wd.s && t < wd.e + 0.1;
        const pop = spring({ frame: frame - startF, fps, config: { damping: 8, stiffness: 220 } });
        return (
          <span
            key={`${pageIdx}-${i}`}
            style={{
              fontFamily: anton,
              fontSize: words.length > 4 ? 108 : 124,
              lineHeight: 1.08,
              textTransform: "uppercase",
              color: active ? COLORS.yellow : COLORS.white,
              WebkitTextStroke: `9px ${COLORS.ink}`,
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

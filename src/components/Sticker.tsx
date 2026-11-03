import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants";
import { EMOJI, montserrat } from "../fonts";

type Props = {
  emoji: string;
  text: string;
  x: number; // center x
  y: number; // center y
  rotate?: number;
  bg?: string;
  color?: string;
  durationInFrames: number;
  fontSize?: number;
};

/** Pill sticker that springs in, gently wiggles, and pops out. Use inside a <Sequence>. */
export const Sticker: React.FC<Props> = ({
  emoji,
  text,
  x,
  y,
  rotate = -4,
  bg = COLORS.white,
  color = COLORS.ink,
  durationInFrames,
  fontSize = 58,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 170 } });
  const leave = spring({ frame: frame - (durationInFrames - 8), fps, config: { damping: 20, stiffness: 200 } });
  const scale = enter * (1 - leave);
  const wiggle = Math.sin(frame / 6) * 2;

  const emojiBounce = interpolate(Math.sin(frame / 4), [-1, 1], [-8, 8]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate + wiggle}deg) scale(${scale})`,
        background: bg,
        color,
        fontFamily: montserrat,
        fontWeight: 900,
        fontSize,
        padding: "16px 36px",
        borderRadius: 999,
        border: `6px solid ${COLORS.ink}`,
        boxShadow: "0 12px 0 rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontFamily: EMOJI, display: "inline-block", transform: `translateY(${emojiBounce}px)` }}>
        {emoji}
      </span>
      {text}
    </div>
  );
};

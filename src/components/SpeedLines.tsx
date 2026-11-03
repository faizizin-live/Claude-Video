import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { HEIGHT, WIDTH } from "../constants";

/** Anime-style horizontal speed lines to sell motion. Use inside a <Sequence>. */
export const SpeedLines: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4, durationInFrames - 6, durationInFrames], [0, 0.55, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: o, mixBlendMode: "screen" }}>
      {new Array(22).fill(0).map((_, i) => {
        const y = random(`sl-y-${i}`) * HEIGHT;
        const len = 200 + random(`sl-l-${i}`) * 500;
        const speed = 60 + random(`sl-s-${i}`) * 60;
        const x = WIDTH - (((frame * speed + random(`sl-o-${i}`) * 3000) % (WIDTH + len * 2)) - len);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: len,
              height: 3 + random(`sl-h-${i}`) * 5,
              borderRadius: 10,
              background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.9))",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

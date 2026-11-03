import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, Easing } from "remotion";
import { sec } from "../constants";

/** Punch-in zoom pulses that land on the beat of each motion-graphic hit. */
const PUNCHES = [sec(5.5), sec(9.4), sec(15.4), sec(20.6)];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // slow push-in over the whole clip
  const drift = interpolate(frame, [0, sec(25.3)], [1.0, 1.08]);

  // quick punch (1.0 -> 1.06 -> 1.0) on each hit
  const punch = PUNCHES.reduce((acc, p) => {
    const v = interpolate(frame, [p, p + 4, p + 16], [0, 0.06, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return acc + v;
  }, 0);

  const fadeOut = interpolate(frame, [sec(24.6), sec(25.3)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift + punch})`, opacity: fadeOut }}>
        <OffthreadVideo
          src={staticFile("velfire.mp4")}
          volume={0.85}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "contrast(1.08) saturate(1.15) brightness(1.02)",
          }}
        />
      </AbsoluteFill>
      {/* cinematic vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

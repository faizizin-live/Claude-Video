import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { sec } from "../constants";
import { CarCharge, ChargeGlow } from "../transform/CarCharge";
import { SeaScene } from "../transform/SeaScene";
import { T } from "../transform/timeline";

/** Punch-in zoom pulses that land on the beat of each motion-graphic hit. */
const PUNCHES = [sec(5.5), sec(9.4), sec(15.4), T.TEASER, T.FLASH];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Camera shake amount: builds during the charge, hits on the flash, rumbles while the boat launches. */
const shakeAmount = (f: number) =>
  interpolate(f, [T.CHARGE, T.FLASH - 1, T.FLASH, T.FLASH + 12], [0, 14, 26, 0], clamp) +
  interpolate(f, [T.LAUNCH, T.LAUNCH + 6, T.LAUNCH + 40], [0, 12, 0], clamp);

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // slow push-in on the footage, held once the frame freezes
  const drift = interpolate(Math.min(frame, T.FREEZE), [0, T.FREEZE], [1.0, 1.07], clamp);

  const punch = PUNCHES.reduce((acc, p) => {
    return (
      acc +
      interpolate(frame, [p, p + 4, p + 16], [0, 0.06, 0], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, 0);

  const sh = shakeAmount(frame);
  const sx = (random(`shx-${frame}`) - 0.5) * 2 * sh;
  const sy = (random(`shy-${frame}`) - 0.5) * 2 * sh;

  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames - 1], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${sx}px, ${sy}px) scale(${drift + punch})`,
          opacity: fadeOut,
          filter: "contrast(1.08) saturate(1.15) brightness(1.02)",
        }}
      >
        {/* live footage (kept mounted until the flash so its audio fades naturally) */}
        {frame < T.FLASH ? (
          <OffthreadVideo
            src={staticFile("velfire.mp4")}
            volume={(f) => interpolate(f, [T.FREEZE, T.FLASH], [0.85, 0], clamp)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}

        {/* freeze frame + glowing car cut-out */}
        {frame >= T.FREEZE && frame < T.FLASH ? (
          <Img src={staticFile("vfx/freeze.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        ) : null}
        {frame >= T.CHARGE && frame < T.FLASH ? <ChargeGlow frame={frame} /> : null}
        {frame >= T.FREEZE && frame < T.FLASH ? <CarCharge frame={frame} /> : null}

        {/* the street floods, the Velfire is now a speedboat */}
        {frame >= T.FLASH ? <SeaScene frame={frame} /> : null}
      </AbsoluteFill>

      {/* cinematic vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

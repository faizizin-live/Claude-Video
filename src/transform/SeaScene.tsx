import { AbsoluteFill, Img, interpolate, random, spring, staticFile } from "remotion";
import { FPS, HEIGHT, WIDTH } from "../constants";
import { Speedboat } from "./Speedboat";
import { BOAT_START, boatState, T, waterTop } from "./timeline";
import { Water } from "./Water";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MOTOR_OFFSETS = [-145, 145]; // motor x offsets from boat centre at scale 1

/** Everything after the flash: flooded street, speedboat, wake, spray and splash. */
export const SeaScene: React.FC<{ frame: number }> = ({ frame }) => {
  const top = waterTop(frame);
  const b = boatState(frame);
  const pop = spring({ frame: frame - T.FLASH - 1, fps: FPS, config: { damping: 9, stiffness: 140, mass: 0.8 } });
  const boatScale = b.scale * (0.35 + 0.65 * pop);
  const launch = interpolate(frame, [T.LAUNCH, T.LAUNCH + 12], [0, 1], clamp);
  const fade = interpolate(b.p, [0.85, 1], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <Img src={staticFile("vfx/clean-plate.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <Water top={top} frame={frame} />

      {/* entry splash ring */}
      <SplashRing frame={frame - T.FLASH} />

      {/* wake trail behind the boat */}
      {launch > 0 ? <Wake frame={frame} strength={launch * fade} /> : null}

      {/* motion-blur ghosts while speeding */}
      {launch > 0
        ? [6, 4, 2].map((lag) => {
            const g = boatState(frame - lag);
            return <Speedboat key={lag} x={g.x} y={g.y} scale={g.scale} tilt={g.tilt} opacity={0.12 * launch * fade} foam={0} />;
          })
        : null}

      <Speedboat x={b.x} y={b.y} scale={boatScale} tilt={b.tilt} opacity={fade} />

      {/* idle churn + rooster-tail spray */}
      <Spray frame={frame} />

      {/* droplets from the transformation splash */}
      <Droplets frame={frame - T.FLASH} />
    </AbsoluteFill>
  );
};

const SplashRing: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 0 || frame > 40) return null;
  const p = frame / 40;
  return (
    <>
      {[0, 0.25].map((k) => {
        const q = Math.max(0, p - k) / (1 - k);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: BOAT_START.x,
              top: BOAT_START.y,
              width: 300 + 900 * q,
              height: 60 + 160 * q,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `${14 * (1 - q) + 2}px solid rgba(255,255,255,${0.85 * (1 - q)})`,
              filter: "blur(2px)",
            }}
          />
        );
      })}
    </>
  );
};

const Droplets: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 0 || frame > 45) return null;
  return (
    <>
      {new Array(60).fill(0).map((_, i) => {
        const ang = Math.PI * (0.05 + 0.9 * random(`da-${i}`));
        const v = 22 + random(`dv-${i}`) * 30;
        const vx = Math.cos(ang) * v * 1.3;
        const vy = -Math.sin(ang) * v;
        const x = BOAT_START.x + (random(`dx-${i}`) - 0.5) * 500 + vx * frame;
        const y = BOAT_START.y - 40 + vy * frame + 1.6 * frame * frame;
        const size = 10 + random(`ds-${i}`) * 26;
        const o = interpolate(frame, [0, 4, 30, 45], [0, 1, 0.8, 0]);
        if (y > HEIGHT + 50) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size * 1.25,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle at 35% 30%, #ffffff 0%, rgba(220,245,255,0.9) 45%, rgba(160,220,240,0.2) 100%)",
              opacity: o,
            }}
          />
        );
      })}
    </>
  );
};

/** Particle spray from the outboards: small churn while idling, a big rooster tail once launched. */
const Spray: React.FC<{ frame: number }> = ({ frame }) => {
  const start = T.FLASH + 10;
  const N = 220;
  const span = T.GONE - start;
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const birth = start + (i / N) * span;
    const age = frame - birth;
    const life = 20;
    if (age < 0 || age > life) continue;
    const st = boatState(birth);
    const speeding = birth >= T.LAUNCH;
    const side = MOTOR_OFFSETS[i % 2];
    const ex = st.x + side * st.scale;
    const ey = st.y + 10 * st.scale;
    const power = speeding ? 1 : 0.25;
    // spray is thrown back toward the camera (down-screen) and outward
    const vx = (side > 0 ? 1 : -1) * (2 + random(`svx-${i}`) * 9) * power + (random(`svj-${i}`) - 0.5) * 4;
    const vy = -(6 + random(`svy-${i}`) * 10) * power * Math.max(0.35, st.scale);
    const x = ex + vx * age * (speeding ? 1.4 : 1);
    const y = ey + vy * age + 0.9 * age * age * power + (speeding ? age * 9 * (1 - st.scale) : 0);
    const size = (18 + random(`ss-${i}`) * 34) * Math.max(0.25, st.scale) * (1 + age * 0.12) * (speeding ? 1.4 : 0.8);
    const o = interpolate(age, [0, 3, life], [0, 0.9, 0]) * (speeding ? 1 : 0.7) * interpolate(st.scale, [0.04, 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    nodes.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(230,248,255,0.6) 45%, rgba(255,255,255,0) 72%)",
          opacity: o,
        }}
      />,
    );
  }
  return <>{nodes}</>;
};

/** White V-wake + churned centre trail on the water behind the boat. */
const Wake: React.FC<{ frame: number; strength: number }> = ({ frame, strength }) => {
  const b = boatState(frame);
  const w = 560 * b.scale;
  // trail origin = where the boat was a moment ago (closer to camera)
  const past = boatState(frame - 18);
  const tx = past.x;
  const spread = 300 + 600 * (1 - b.scale);
  const shimmer = (k: number) => 0.85 + 0.15 * Math.sin(frame * 0.9 + k);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity: strength }}>
      <defs>
        <linearGradient id="wake-core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="0.35" stopColor="#e6f7ff" stopOpacity={0.35} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <filter id="wake-blur">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <polygon
        points={`${b.x - w * 0.38},${b.y} ${b.x + w * 0.38},${b.y} ${tx + 150},${HEIGHT} ${tx - 150},${HEIGHT}`}
        fill="url(#wake-core)"
        opacity={0.6 * shimmer(1)}
        filter="url(#wake-blur)"
      />
      {[-1, 1].map((s) => (
        <g key={s}>
          <line
            x1={b.x + s * w * 0.5}
            y1={b.y}
            x2={tx + s * spread * 1.6}
            y2={HEIGHT}
            stroke="#ffffff"
            strokeWidth={10}
            strokeLinecap="round"
            opacity={0.35 * shimmer(s * 2)}
            filter="url(#wake-blur)"
          />
          <line
            x1={b.x + s * w * 0.5}
            y1={b.y}
            x2={tx + s * spread * 2.4}
            y2={HEIGHT}
            stroke="#ffffff"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.18 * shimmer(s * 3)}
            filter="url(#wake-blur)"
          />
        </g>
      ))}
    </svg>
  );
};

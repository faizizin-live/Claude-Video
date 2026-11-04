import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EmojiBurst } from "../components/EmojiBurst";
import { Flash } from "../components/Flash";
import { ProgressBar } from "../components/ProgressBar";
import { SafeZoneGuide } from "../components/SafeZoneGuide";
import { Sticker } from "../components/Sticker";
import { COLORS, SAFE_BOX } from "../constants";
import { Captions } from "./Captions";
import { MessageCard } from "./MessageCard";
import { EndCard, Hook, Poll } from "./Overlays";
import { B, FPS, MESSAGE_IN, MESSAGE_OUT, TRIM_START, at } from "./timeline";

export type AhsoProps = {
  /** Render the TikTok/IG safe-zone overlay (for checking layout only). */
  showSafeZone: boolean;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const s = (sec: number) => Math.round(sec * FPS);

/** Punch-in zooms that land on the big beats. */
const PUNCHES = [B.recovery, B.thanksGod, B.towel, B.comel, B.kelakar].map(at);

type Sfx = { at: number; file: string; volume?: number };
// Every SFX is synced to a visual beat (times are SOURCE seconds -> at()).
const SFX: Sfx[] = [
  { at: 0, file: "whoosh-short.wav", volume: 0.5 }, // hook in
  { at: 4, file: "pop.wav", volume: 0.55 }, // DARI AHSO box
  { at: at(MESSAGE_IN), file: "notif.wav", volume: 0.6 }, // message arrives
  { at: at(MESSAGE_IN) + 6, file: "typing.wav", volume: 0.35 },
  { at: at(B.hookEnd) - 8, file: "whoosh-short.wav", volume: 0.35 }, // hook exits
  { at: at(B.beautiful), file: "heart.wav", volume: 0.5 },
  { at: at(B.blessed), file: "sparkle.wav", volume: 0.35 },
  { at: at(B.recovery), file: "pop.wav", volume: 0.6 }, // CEPAT SEMBUH
  { at: at(B.recovery), file: "whoosh-short.wav", volume: 0.35 },
  { at: at(B.stronger), file: "heart.wav", volume: 0.5 },
  { at: at(B.lookAtYou), file: "pop.wav", volume: 0.5 }, // TERHARU
  { at: at(B.thanksGod), file: "sparkle.wav", volume: 0.45 }, // ALHAMDULILLAH
  { at: at(B.thanksGod) + 2, file: "pop.wav", volume: 0.6 },
  { at: at(MESSAGE_OUT), file: "whoosh.wav", volume: 0.4 }, // card leaves
  { at: at(B.thankYou), file: "ding.wav", volume: 0.35 },
  // --- the fun part ---
  { at: at(B.pan) - 6, file: "whoosh.wav", volume: 0.5 }, // camera swings to Yaya
  { at: at(B.towel), file: "boing.wav", volume: 0.55 }, // TUDUNG TUALA
  { at: at(B.towel) + 2, file: "pop.wav", volume: 0.55 },
  { at: at(B.comel), file: "sparkle.wav", volume: 0.45 },
  { at: at(B.comel) + 2, file: "heart.wav", volume: 0.45 },
  { at: at(B.poll), file: "pop.wav", volume: 0.6 }, // poll card
  { at: at(B.poll) + 8, file: "click.wav", volume: 0.5 },
  { at: at(B.poll) + 13, file: "click.wav", volume: 0.5 },
  { at: at(B.yaya), file: "pop.wav", volume: 0.6 }, // YAYA tag
  { at: at(B.kelakar), file: "boing.wav", volume: 0.6 },
  { at: at(B.kelakar) + 3, file: "pop.wav", volume: 0.5 },
  { at: at(B.endCard), file: "whoosh-short.wav", volume: 0.45 },
  { at: at(B.endCard) + 8, file: "sparkle.wav", volume: 0.45 },
  { at: at(B.endCard) + 40, file: "ding.wav", volume: 0.45 },
];

const Footage: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [1.0, 1.06]);
  const punch = PUNCHES.reduce(
    (acc, p) => acc + interpolate(frame, [p, p + 4, p + 16], [0, 0.05, 0], { ...clamp, easing: Easing.out(Easing.cubic) }),
    0,
  );
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 1], [1, 0], clamp);
  // warm grade during the message, brighter/punchier for the fun part
  const warm = interpolate(frame, [at(B.pan) - 10, at(B.pan) + 10], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${drift + punch})`,
          opacity: fadeOut,
          filter: `contrast(1.06) saturate(${1.1 + 0.08 * (1 - warm)}) brightness(1.03) sepia(${0.12 * warm})`,
        }}
      >
        <OffthreadVideo
          src={staticFile("ahso.mp4")}
          trimBefore={s(TRIM_START)}
          volume={(f) => interpolate(f, [durationInFrames - 20, durationInFrames - 1], [1, 0], clamp)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {/* vignette, heavier at the bottom so the card/captions pop */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%), linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Music beds: warm pad under the message, playful pluck loop for the fun part. */
const Music: React.FC = () => {
  const padFrom = at(MESSAGE_IN) - 6;
  const padLen = at(B.pan) - padFrom + 10;
  const funFrom = at(B.pan) - 4;
  const { durationInFrames } = useVideoConfig();
  const funLen = durationInFrames - funFrom;
  return (
    <>
      <Sequence from={padFrom} durationInFrames={padLen} name="Music: pad">
        <Audio
          src={staticFile("sfx/pad-bed.wav")}
          volume={(f) => interpolate(f, [0, 45, padLen - 40, padLen], [0, 0.16, 0.16, 0], clamp)}
        />
      </Sequence>
      <Sequence from={funFrom} durationInFrames={funLen} name="Music: bouncy">
        <Audio
          src={staticFile("sfx/bouncy-bed.wav")}
          loop
          volume={(f) => interpolate(f, [0, 15, funLen - 30, funLen], [0, 0.11, 0.11, 0], clamp)}
        />
      </Sequence>
    </>
  );
};

export const ReadingMsgAhso: React.FC<AhsoProps> = ({ showSafeZone }) => {
  const hookLen = at(B.hookEnd);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Footage />
      <Music />

      {/* ---------- part 1: reading the message ---------- */}
      <Sequence from={0} durationInFrames={hookLen} name="Hook">
        <Hook durationInFrames={hookLen} />
      </Sequence>

      <MessageCard />

      <Sequence from={at(B.beautiful)} durationInFrames={s(2.4)} name="Burst: beautiful">
        <EmojiBurst emojis={["💕", "🥰", "💖"]} count={8} seed="beautiful" originY={SAFE_BOX.bottomY - 470} />
      </Sequence>
      <Sequence from={at(B.blessed)} durationInFrames={s(2.4)} name="Burst: blessed">
        <EmojiBurst emojis={["✨", "🤍", "✨"]} count={8} seed="blessed" originY={SAFE_BOX.bottomY - 470} />
      </Sequence>
      <Sequence from={at(B.recovery)} durationInFrames={s(3.4)} name="Sticker: cepat sembuh">
        <Sticker emoji="💪" text="CEPAT SEMBUH!" x={SAFE_BOX.centerX} y={SAFE_BOX.y + 120} rotate={-4} bg={COLORS.yellow} durationInFrames={s(3.4)} />
      </Sequence>
      <Sequence from={at(B.stronger)} durationInFrames={s(2.4)} name="Burst: stronger">
        <EmojiBurst emojis={["❤️", "💪", "❤️"]} count={8} seed="stronger" originY={SAFE_BOX.bottomY - 470} />
      </Sequence>
      <Sequence from={at(B.lookAtYou)} durationInFrames={s(4.6)} name="Sticker: terharu">
        <Sticker emoji="🥹" text="TERHARU..." x={SAFE_BOX.centerX} y={SAFE_BOX.y + 120} rotate={3} durationInFrames={s(4.6)} />
      </Sequence>
      <Sequence from={at(B.thanksGod)} durationInFrames={s(3.6)} name="Sticker: alhamdulillah">
        <Sticker emoji="🤲" text="ALHAMDULILLAH" x={SAFE_BOX.centerX} y={SAFE_BOX.y + 120} rotate={-3} bg={COLORS.cyan} durationInFrames={s(3.6)} />
      </Sequence>
      <Sequence from={at(B.thanksGod)} durationInFrames={s(2.6)} name="Burst: thanks">
        <EmojiBurst emojis={["✨", "🤍", "🌟"]} count={10} seed="thanks" originY={SAFE_BOX.bottomY - 470} />
      </Sequence>

      {/* ---------- part 2: Yaya ---------- */}
      <Sequence from={at(B.pan)} durationInFrames={12} name="Flash: to Yaya">
        <Flash strength={0.55} />
      </Sequence>
      <Sequence from={at(B.towel)} durationInFrames={s(4.4)} name="Sticker: tudung tuala">
        <Sticker emoji="🧕" text="TUDUNG TUALA" x={SAFE_BOX.centerX} y={SAFE_BOX.y + 120} rotate={-5} bg={COLORS.pink} color={COLORS.white} durationInFrames={s(4.4)} />
      </Sequence>
      <Sequence from={at(B.comel)} durationInFrames={s(2.6)} name="Burst: comel">
        <EmojiBurst emojis={["🥰", "💕", "✨"]} count={10} seed="comel" />
      </Sequence>
      <Sequence from={at(B.poll)} durationInFrames={at(70.9) - at(B.poll)} name="Poll: makan / puasa">
        <Poll durationInFrames={at(70.9) - at(B.poll)} />
      </Sequence>
      <Sequence from={at(B.yaya)} durationInFrames={at(71.0) - at(B.yaya)} name="Tag: Yaya">
        <Sticker emoji="👧" text="YAYA" x={SAFE_BOX.x + 170} y={SAFE_BOX.y + 110} rotate={-6} bg={COLORS.yellow} fontSize={52} durationInFrames={at(71.0) - at(B.yaya)} />
      </Sequence>
      <Sequence from={at(B.kelakar)} durationInFrames={s(2.4)} name="Burst: kelakar">
        <EmojiBurst emojis={["🤣", "😂", "🤭"]} count={10} seed="kelakar" />
      </Sequence>

      <Captions />

      <Sequence from={at(B.endCard)} name="End card">
        <EndCard />
      </Sequence>

      <ProgressBar />

      {SFX.map((x, i) => (
        <Sequence key={i} from={x.at} durationInFrames={s(6)} name={`SFX ${x.file}`}>
          <Audio src={staticFile(`sfx/${x.file}`)} volume={x.volume ?? 1} />
        </Sequence>
      ))}

      {showSafeZone ? <SafeZoneGuide /> : null}
    </AbsoluteFill>
  );
};

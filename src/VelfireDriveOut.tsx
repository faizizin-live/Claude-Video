import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { EmojiBurst } from "./components/EmojiBurst";
import { EndCard } from "./components/EndCard";
import { Flash } from "./components/Flash";
import { HookTitle } from "./components/HookTitle";
import { ProgressBar } from "./components/ProgressBar";
import { SafeZoneGuide } from "./components/SafeZoneGuide";
import { SpeedLines } from "./components/SpeedLines";
import { Sticker } from "./components/Sticker";
import { COLORS, SAFE_BOX, sec } from "./constants";
import { T } from "./transform/timeline";
import { TransformTitle } from "./transform/TransformTitle";

export type VelfireProps = {
  /** Render the TikTok/IG safe-zone overlay (for checking layout only). */
  showSafeZone: boolean;
};

type Sfx = { at: number; file: string; volume?: number };

// Every SFX is synced to a visual beat below.
const SFX: Sfx[] = [
  { at: 0, file: "bass-hit.wav", volume: 0.7 },
  { at: sec(0.15), file: "whoosh-short.wav", volume: 0.5 },
  { at: sec(0.6), file: "pop.wav", volume: 0.6 }, // DRIVE OUT box
  { at: sec(2.2), file: "whoosh.wav", volume: 0.55 }, // hook exits
  { at: sec(4.9), file: "engine-rev.wav", volume: 0.45 }, // car starts rolling
  { at: sec(5.5), file: "pop.wav", volume: 0.7 }, // ENJIN ON sticker
  { at: sec(9.35), file: "whoosh.wav", volume: 0.55 }, // flash -> passengers
  { at: sec(9.5), file: "pop.wav", volume: 0.6 },
  { at: sec(11.0), file: "sparkle.wav", volume: 0.45 }, // waving emojis
  { at: sec(11.3), file: "pop.wav", volume: 0.8 }, // caption "BYE"
  { at: sec(11.75), file: "pop.wav", volume: 0.8 }, // caption "ANIS!"
  { at: sec(15.35), file: "whoosh-short.wav", volume: 0.6 }, // OTW sticker
  { at: sec(15.45), file: "pop.wav", volume: 0.6 },
  // --- car -> speedboat transformation ---
  { at: T.TEASER, file: "whoosh-short.wav", volume: 0.5 }, // "eh tunggu jap"
  { at: T.TEASER + 2, file: "pop.wav", volume: 0.6 },
  { at: T.FLASH - 51, file: "riser.wav", volume: 0.75 }, // charge-up peaks on the flash
  { at: T.FREEZE, file: "zap.wav", volume: 0.55 },
  { at: T.FREEZE + 1, file: "bass-hit.wav", volume: 0.45 }, // TRANSFORM! slam
  { at: T.FREEZE + 13, file: "zap.wav", volume: 0.6 },
  { at: T.FLASH, file: "bass-hit.wav", volume: 0.55 }, // flash
  { at: T.FLASH, file: "splash.wav", volume: 0.65 },
  { at: T.FLASH, file: "whoosh.wav", volume: 0.35 },
  { at: T.FLASH + 2, file: "sea-ambience.wav", volume: 0.55 },
  { at: T.FLASH + 16, file: "pop.wav", volume: 0.6 }, // MODE SPEEDBOAT sticker
  { at: T.LAUNCH - 39, file: "boat-engine.wav", volume: 0.8 }, // idle -> throttle on LAUNCH
  { at: T.LAUNCH, file: "whoosh.wav", volume: 0.55 },
  { at: T.LAUNCH + 2, file: "splash.wav", volume: 0.45 },
  { at: T.END_CARD, file: "sparkle.wav", volume: 0.5 },
  { at: T.END_CARD + 48, file: "ding.wav", volume: 0.5 },
];

export const VelfireDriveOut: React.FC<VelfireProps> = ({ showSafeZone }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Background />

      {/* 0.0s - 2.5s : hook title */}
      <Sequence from={0} durationInFrames={sec(2.5)} name="Hook title">
        <HookTitle durationInFrames={sec(2.5)} />
      </Sequence>

      {/* 5.5s : car starts moving */}
      <Sequence from={sec(5.5)} durationInFrames={sec(3.2)} name="Sticker: Enjin ON">
        <Sticker emoji="🔑" text="ENJIN ON!" x={SAFE_BOX.centerX} y={SAFE_BOX.y + 230} rotate={-5} durationInFrames={sec(3.2)} />
      </Sequence>

      {/* 9.4s : passengers waving */}
      <Sequence from={sec(9.35)} durationInFrames={12} name="Flash 1">
        <Flash strength={0.6} />
      </Sequence>
      <Sequence from={sec(9.5)} durationInFrames={sec(5.5)} name="Sticker: Lambai">
        <Sticker
          emoji="👋"
          text="LAMBAI DULU!"
          x={SAFE_BOX.centerX}
          y={SAFE_BOX.y + 230}
          rotate={4}
          bg={COLORS.yellow}
          durationInFrames={sec(5.5)}
        />
      </Sequence>
      <Sequence from={sec(11.0)} durationInFrames={sec(3)} name="Emoji burst">
        <EmojiBurst emojis={["👋", "💛", "👋", "😍"]} count={12} seed="wave" />
      </Sequence>

      {/* transcript-driven captions (data/transcript.json) */}
      <Captions />

      {/* 15.4s : driving off */}
      <Sequence from={sec(15.4)} durationInFrames={sec(3.6)} name="Speed lines">
        <SpeedLines durationInFrames={sec(3.6)} />
      </Sequence>
      <Sequence from={sec(15.45)} durationInFrames={sec(4.2)} name="Sticker: OTW">
        <Sticker
          emoji="🛣️"
          text="OTW JALAN-JALAN"
          x={SAFE_BOX.centerX}
          y={SAFE_BOX.y + 230}
          rotate={-3}
          bg={COLORS.cyan}
          durationInFrames={sec(4.2)}
          fontSize={54}
        />
      </Sequence>

      {/* 21.0s : car leaves the gate -> teaser */}
      <Sequence from={T.TEASER} durationInFrames={sec(1.9)} name="Sticker: Tunggu jap">
        <Sticker
          emoji="👀"
          text="EH, TUNGGU JAP..."
          x={SAFE_BOX.centerX}
          y={SAFE_BOX.y + 230}
          rotate={3}
          bg={COLORS.white}
          durationInFrames={sec(1.9)}
        />
      </Sequence>

      {/* 23.5s : freeze + TRANSFORM! */}
      <Sequence from={T.FREEZE} durationInFrames={T.FLASH - T.FREEZE} name="TRANSFORM title">
        <TransformTitle durationInFrames={T.FLASH - T.FREEZE} />
      </Sequence>

      {/* 24.4s : flash -> speedboat */}
      <Sequence from={T.FLASH - 1} durationInFrames={16} name="Flash: transform">
        <Flash strength={1} />
      </Sequence>
      <Sequence from={T.FLASH + 16} durationInFrames={T.LAUNCH - T.FLASH + 6} name="Sticker: Mode speedboat">
        <Sticker
          emoji="🚤"
          text="MODE SPEEDBOAT!"
          x={SAFE_BOX.centerX}
          y={SAFE_BOX.y + 230}
          rotate={-4}
          bg={COLORS.yellow}
          durationInFrames={T.LAUNCH - T.FLASH + 6}
        />
      </Sequence>

      {/* 27.6s : end card */}
      <Sequence from={T.END_CARD} name="End card">
        <EndCard subtitle="Hati-hati di laut!" emoji="🌊" />
      </Sequence>

      <ProgressBar />

      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} name={`SFX ${s.file}`} layout="none">
          <Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume ?? 0.6} />
        </Sequence>
      ))}

      {showSafeZone ? <SafeZoneGuide /> : null}
    </AbsoluteFill>
  );
};

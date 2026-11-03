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
  { at: sec(20.5), file: "whoosh.wav", volume: 0.6 }, // flash -> end card
  { at: sec(20.7), file: "bass-hit.wav", volume: 0.6 },
  { at: sec(21.0), file: "sparkle.wav", volume: 0.5 },
  { at: sec(23.2), file: "ding.wav", volume: 0.5 },
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

      {/* 20.6s : end card */}
      <Sequence from={sec(20.5)} durationInFrames={12} name="Flash 2">
        <Flash strength={0.7} />
      </Sequence>
      <Sequence from={sec(20.7)} name="End card">
        <EndCard />
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

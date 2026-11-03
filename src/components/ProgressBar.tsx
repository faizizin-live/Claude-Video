import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE_BOX } from "../constants";

/** Thin retention progress bar at the top edge of the safe zone. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / (durationInFrames - 1);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        top: SAFE_BOX.y + 10,
        width: SAFE_BOX.width,
        height: 10,
        borderRadius: 10,
        background: "rgba(255,255,255,0.25)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${COLORS.yellow}, ${COLORS.pink})`,
        }}
      />
    </div>
  );
};

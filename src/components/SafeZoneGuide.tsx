import { AbsoluteFill } from "remotion";
import { HEIGHT, SAFE, SAFE_BOX, WIDTH } from "../constants";

/** Preview-only overlay showing the combined TikTok + IG Reels UI areas. */
export const SafeZoneGuide: React.FC = () => {
  const shade = "rgba(255, 0, 80, 0.28)";
  const label: React.CSSProperties = {
    position: "absolute",
    color: "white",
    fontFamily: "monospace",
    fontSize: 26,
    fontWeight: 700,
    textShadow: "0 2px 4px #000",
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: SAFE.top, background: shade }} />
      <div style={{ position: "absolute", left: 0, top: HEIGHT - SAFE.bottom, width: WIDTH, height: SAFE.bottom, background: shade }} />
      <div style={{ position: "absolute", left: 0, top: SAFE.top, width: SAFE.left, height: SAFE_BOX.height, background: shade }} />
      <div style={{ position: "absolute", right: 0, top: SAFE.top, width: SAFE.right, height: SAFE_BOX.height, background: shade }} />
      <div
        style={{
          position: "absolute",
          left: SAFE_BOX.x,
          top: SAFE_BOX.y,
          width: SAFE_BOX.width,
          height: SAFE_BOX.height,
          border: "4px dashed #00FF88",
          boxSizing: "border-box",
        }}
      />
      <div style={{ ...label, left: 20, top: 20 }}>TOP UI {SAFE.top}px (IG header / TikTok tabs)</div>
      <div style={{ ...label, left: 20, top: HEIGHT - SAFE.bottom + 20 }}>
        BOTTOM UI {SAFE.bottom}px (caption / music / nav)
      </div>
      <div style={{ ...label, right: 10, top: 900, writingMode: "vertical-rl" }}>
        RIGHT RAIL {SAFE.right}px (like / comment / share)
      </div>
    </AbsoluteFill>
  );
};

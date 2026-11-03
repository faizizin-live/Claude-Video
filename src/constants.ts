export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Source clip is 25.33s; we freeze at 23.5s and extend with the speedboat VFX to 30s
export const DURATION_IN_FRAMES = 900;

/**
 * Combined TikTok + Instagram Reels safe zone for a 1080x1920 canvas.
 * Takes the stricter value of both platforms on every edge:
 *  - top:    IG Reels header / TikTok "Following | For You" tabs  (~250px)
 *  - bottom: caption, username, music ticker, IG/TikTok nav       (~480px)
 *  - right:  TikTok like/comment/share/profile rail, IG actions   (~180px)
 *  - left:   general margin                                       (~60px)
 * All text & graphics are kept inside this box.
 */
export const SAFE = {
  top: 250,
  bottom: 480,
  left: 60,
  right: 180,
} as const;

export const SAFE_BOX = {
  x: SAFE.left,
  y: SAFE.top,
  width: WIDTH - SAFE.left - SAFE.right, // 840
  height: HEIGHT - SAFE.top - SAFE.bottom, // 1190
  bottomY: HEIGHT - SAFE.bottom, // 1440
  centerX: SAFE.left + (WIDTH - SAFE.left - SAFE.right) / 2, // 480
} as const;

export const COLORS = {
  yellow: "#FFD60A",
  white: "#FFFFFF",
  ink: "#0B0B0F",
  pink: "#FF3D7F",
  cyan: "#22D3EE",
};

export const sec = (s: number) => Math.round(s * FPS);

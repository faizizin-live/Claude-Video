import { Easing, interpolate } from "remotion";
import { sec } from "../constants";

/** Car -> speedboat transformation beats (absolute composition frames). */
export const T = {
  TEASER: sec(21.0), // "eh tunggu jap..." sticker
  CHARGE: sec(23.0), // glow starts building on the live footage
  FREEZE: sec(23.5), // frame 705: footage freezes, car cut-out takes over
  FLASH: sec(24.4), // white flash -> water + speedboat
  WATER_DONE: sec(24.4) + 6, // water floods in while the flash is still bright
  LAUNCH: sec(26.33), // boat throttles away
  GONE: sec(29.0),
  END_CARD: sec(27.6),
} as const;

/** Car centre in the freeze frame (from scripts/make_vfx_plates.py bbox 401,826 - 1079,1442). */
export const CAR = { cx: 740, cy: 1134, x0: 401, y0: 826, x1: 1079, y1: 1442 } as const;

/** Water horizon after the street floods (just under the building line, above the car roof). */
export const HORIZON = 845;
/** Vanishing point the boat races toward. */
export const VANISH_X = 540;

export const BOAT_START = { x: 730, y: 1395 } as const; // waterline centre, where the car was

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const waterTop = (f: number) =>
  interpolate(f, [T.FLASH, T.WATER_DONE], [1920, HORIZON], { ...clamp, easing: Easing.out(Easing.cubic) });

/**
 * Boat state at a frame: waterline centre (x, y) and perspective scale.
 * Before LAUNCH it bobs in place; after LAUNCH it accelerates toward the horizon.
 */
export const boatState = (f: number) => {
  const p = interpolate(f, [T.LAUNCH, T.GONE], [0, 1], clamp);
  const dist = Math.pow(p, 1.7) * 32; // accelerating distance
  const scale = 1 / (1 + dist);
  const bob = f < T.LAUNCH ? Math.sin(f / 7) * 6 : Math.sin(f / 3) * 3 * scale;
  // slight S-curve as it powers away
  const swerve = Math.sin(p * Math.PI * 1.5) * 70 * scale;
  const x = VANISH_X + (BOAT_START.x - VANISH_X) * scale + swerve;
  const y = HORIZON + (BOAT_START.y - HORIZON) * scale + bob;
  const tilt = f < T.LAUNCH ? Math.sin(f / 9) * 1.5 : Math.sin(f / 2.5) * 2.5 * scale;
  return { x, y, scale, tilt, p };
};

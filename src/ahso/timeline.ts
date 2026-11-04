import transcript from "./transcript.json";

export const FPS = 30;
/** The source clip has ~3.5s of near-silence before he starts reading – we cut it. */
export const TRIM_START = 3.5; // source seconds
export const SOURCE_END = 79.0; // source seconds
export const DURATION_IN_FRAMES = Math.round((SOURCE_END - TRIM_START) * FPS); // 2265 (75.5s)

/** Convert a SOURCE time (seconds, as in transcript.json) into a composition frame. */
export const at = (sourceSec: number) => Math.round((sourceSec - TRIM_START) * FPS);
/** Composition frame -> source seconds. */
export const srcTime = (frame: number) => frame / FPS + TRIM_START;

export type Word = { w: string; s: number; e: number };
export const WORDS = transcript.words as Word[];

/**
 * The message from Ahso, as he reads it out. Each sentence is a range of
 * transcript word indices plus the nicely-cased text shown in the chat card
 * (same number of words as the range).
 */
export const MESSAGE: { from: number; to: number; text: string }[] = [
  { from: 1, to: 10, text: "That little one, your baby is so adorable and beautiful." },
  { from: 11, to: 18, text: "May good people always be blessed with peace," },
  { from: 19, to: 26, text: "and may his father make a speedy recovery." },
  { from: 27, to: 30, text: "Good deeds are rewarded." },
  { from: 31, to: 36, text: "Thank you for your kind concern." },
  { from: 37, to: 48, text: "I hope your health continues to improve and grow stronger every day," },
  { from: 49, to: 55, text: "and that you enjoy ever better well-being." },
  { from: 56, to: 69, text: "Every day when I look at you all, I can't help but to think" },
  { from: 70, to: 73, text: "I too am …" },
  { from: 74, to: 77, text: "Thanks be to God." },
];
export const MESSAGE_IN = 3.9; // source s – chat card slides in
export const MESSAGE_OUT = 40.7; // source s – chat card leaves (before "Thank you")

/** Word-pop caption pages (transcript word index ranges) for everything spoken after the message. */
export const CAPTION_PAGES: [number, number][] = [
  [78, 79], // Thank you
  [80, 84], // Adik, betul lah tu adik
  [85, 86], // Comel sangat
  [87, 88], // Comel sangat
  [89, 92], // Hari ni nak makan
  [93, 95], // ke, nak puasa?
  [96, 98], // Kita tanya Yaya
  [99, 101], // lah soalan tu
  [102, 105], // Yaya, hari ni nak
  [106, 110], // makan ke, nak puasa ya?
  [111, 113], // Kelakar je bunyi
];

/** Key beats, in SOURCE seconds. */
export const B = {
  hookEnd: 6.6,
  beautiful: 8.23,
  blessed: 11.19,
  recovery: 14.67,
  stronger: 23.87,
  lookAtYou: 31.27,
  thanksGod: 37.45,
  thankYou: 40.93,
  pan: 51.9, // camera swings to Yaya
  towel: 53.6, // she walks in with the towel "tudung"
  comel: 56.08,
  poll: 62.6,
  yaya: 67.39,
  kelakar: 73.44,
  endCard: 75.2,
};

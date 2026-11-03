# Velfire Drive Out — Remotion edit (TikTok / IG Reels)

9:16 (1080×1920, 30fps, 25.3s) edit of `Velfire drive out.mp4` built with [Remotion](https://remotion.dev).

## Pipeline
1. **Transcribe** – `scripts/transcribe.py` (faster-whisper `large-v3`, Malay). The clip is mostly ambient
   noise; the only speech detected is a short shout at ~11.3s ("Bye, Anis!"). Result is stored in
   `src/data/transcript.json` – edit the words/timings there and the captions update automatically.
2. **Motion graphics** – `src/components/*` (hook title, stickers, word-pop captions, emoji burst,
   speed lines, flashes, punch-in zooms, progress bar, end card).
3. **Sound effects** – `scripts/gen_sfx.py` procedurally generates royalty-free SFX into `public/sfx/`
   (whoosh, pop, bass hit, sparkle, ding, engine rev). They are timed to the visuals in
   `src/VelfireDriveOut.tsx` (`SFX` array).
4. **Safe zone** – every graphic is positioned from `SAFE_BOX` in `src/constants.ts`, the stricter of
   TikTok and IG Reels on each edge: top 250px, bottom 480px, right 180px, left 60px.

## Timeline
| Time | Visual | SFX |
|---|---|---|
| 0.0–2.5s | "VELFIRE / DRIVE OUT 🚐" hook title | bass hit, whoosh, pop |
| 5.5s | "🔑 ENJIN ON!" sticker + punch zoom | engine rev, pop |
| 9.4s | flash → "👋 LAMBAI DULU!" sticker | whoosh, pop |
| 11.0–12.6s | emoji burst + caption **BYE ANIS!** | sparkle, pop ×2 |
| 15.4s | speed lines + "🛣️ OTW JALAN-JALAN" | whoosh, pop |
| 20.5s→end | flash → "SELAMAT JALAN!" end card, fade out | whoosh, bass hit, sparkle, ding |

## Commands
```bash
npm install
npm run studio          # preview/edit in Remotion Studio
npm run render          # -> out/velfire-drive-out.mp4
npm run render:guides   # same, with the safe-zone overlay drawn
npm run sfx             # regenerate sound effects
```
Fonts (Montserrat, Anton – SIL OFL) are bundled in `public/fonts` so renders work offline.

import { continueRender, delayRender, staticFile } from "remotion";

// Fonts are bundled in public/fonts (SIL Open Font License, from Google Fonts)
// so renders work offline and never wait on a CDN.
export const montserrat = "MontserratLocal";
export const anton = "AntonLocal";
export const EMOJI = '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji"';

const faces = [
  new FontFace(montserrat, `url(${staticFile("fonts/Montserrat-Variable.woff2")}) format("woff2")`, {
    weight: "100 900",
  }),
  new FontFace(anton, `url(${staticFile("fonts/Anton-Regular.woff2")}) format("woff2")`),
];

const handle = delayRender("Loading local fonts");
Promise.all(faces.map((f) => f.load()))
  .then((loaded) => {
    loaded.forEach((f) => document.fonts.add(f));
    continueRender(handle);
  })
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });

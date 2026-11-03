import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/** Short white flash transition. Use inside a <Sequence>. */
export const Flash: React.FC<{ strength?: number }> = ({ strength = 0.7 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 2, 10], [0, strength, 0], {
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: "white", opacity: o }} />;
};

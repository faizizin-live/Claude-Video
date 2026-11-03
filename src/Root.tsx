import { Composition } from "remotion";
import { VelfireDriveOut, VelfireProps } from "./VelfireDriveOut";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VelfireDriveOut"
      component={VelfireDriveOut}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ showSafeZone: false } satisfies VelfireProps}
    />
  );
};

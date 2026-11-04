import { Composition } from "remotion";
import { AhsoProps, ReadingMsgAhso } from "./ahso/ReadingMsgAhso";
import { DURATION_IN_FRAMES as AHSO_DURATION, FPS as AHSO_FPS } from "./ahso/timeline";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./constants";
import { VelfireDriveOut, VelfireProps } from "./VelfireDriveOut";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VelfireDriveOut"
        component={VelfireDriveOut}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ showSafeZone: false } satisfies VelfireProps}
      />
      <Composition
        id="ReadingMsgAhso"
        component={ReadingMsgAhso}
        durationInFrames={AHSO_DURATION}
        fps={AHSO_FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ showSafeZone: false } satisfies AhsoProps}
      />
    </>
  );
};

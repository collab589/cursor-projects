import { Composition, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { JesusBaptismMain } from "./JesusBaptismMain";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="JesusBaptism"
        component={JesusBaptismMain}
        durationInFrames={300}  // 10s @ 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

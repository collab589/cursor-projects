import { useCurrentFrame, useVideoConfig, AbsoluteFill, Sequence, interpolate, Easing } from "remotion";
import { Sky } from "./components/Sky";
import { Hills } from "./components/Hills";
import { River } from "./components/River";
import { LightRays } from "./components/LightRays";
import { Particles } from "./components/Particles";
import { Jesus } from "./components/Jesus";
import { John } from "./components/John";
import { Dove } from "./components/Dove";
import { Subtitle } from "./components/Subtitle";

// Scene timing (in frames at 30fps)
const SCENE1_END = 90;       // 0-3s: Landscape + title
const SCENE2_END = 165;      // 3-5.5s: Baptism
const SCENE3_END = 225;      // 5.5-7.5s: Heaven opens + dove
const SCENE4_END = 300;      // 7.5-10s: Divine voice

// Subtitle lines with timing
const SUBTITLES = [
  { text: "耶稣受了洗，随即从水里上来。", startFrame: 0, endFrame: 90, audio: "line1.wav" },
  { text: "天忽然为他开了，", startFrame: 90, endFrame: 140, audio: "line2.wav" },
  { text: "他就看见神的灵，仿佛鸽子降下，落在他身上。", startFrame: 140, endFrame: 225, audio: "line3.wav" },
  { text: "从天上有声音说：「这是我的爱子，我所喜悦的。」", startFrame: 225, endFrame: 300, audio: "line4.wav" },
];

export const JesusBaptismMain = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master fade-in at start, fade-out at end
  const masterFadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const masterFadeOut = interpolate(frame, [280, 300], [1, 0], { extrapolateLeft: "clamp" });
  const masterOpacity = masterFadeIn * masterFadeOut;

  // Scene-specific opacities
  const scene2Opacity = interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scene3Opacity = interpolate(frame, [155, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Title animation
  const titleOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const titleFadeOut = interpolate(frame, [70, 90], [1, 0], { extrapolateRight: "clamp" });

  // Sky brightness increases when heaven opens
  const heavenGlow = interpolate(frame, [160, 180, 200, 220], [0, 1, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Voice subtitle for scene 4
  const voiceOpacity = interpolate(frame, [230, 240, 285, 300], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a2a40" }}>
      {/* ===== Audio track (added in post-processing via Python) ===== */}
      {/* Audio files are WAV format - Remotion doesn't support WAV natively.
           Audio will be merged with video using moviepy after rendering. */}

      {/* ===== Visual layers ===== */}
      <AbsoluteFill style={{ opacity: masterOpacity }}>

        {/* Base landscape - always visible */}
        <Sky heavenGlow={heavenGlow} />
        <Hills />
        <River />

        {/* Light rays - appear in scene 3 */}
        <AbsoluteFill style={{ opacity: scene3Opacity }}>
          <LightRays />
          <Particles />
        </AbsoluteFill>

        {/* Jesus - appears in scene 2 */}
        <AbsoluteFill style={{ opacity: scene2Opacity, zIndex: 5 }}>
          <Jesus />
        </AbsoluteFill>

        {/* John - appears in scene 2 */}
        <AbsoluteFill style={{ opacity: scene2Opacity, zIndex: 4 }}>
          <John />
        </AbsoluteFill>

        {/* Dove - appears in scene 3 */}
        <AbsoluteFill style={{ opacity: scene3Opacity, zIndex: 6 }}>
          <Dove />
        </AbsoluteFill>

        {/* ===== Title overlay ===== */}
        <AbsoluteFill style={{ zIndex: 10, opacity: titleOpacity * titleFadeOut }}>
          <div style={{
            position: "absolute",
            top: "8%",
            width: "100%",
            textAlign: "center",
            fontSize: 64,
            fontWeight: "bold",
            color: "#fff",
            fontFamily: "KaiTi, STKaiti, SimSun, serif",
            letterSpacing: "0.5em",
            textShadow: "0 0 30px rgba(255,200,100,0.6), 0 0 60px rgba(255,180,60,0.3), 0 4px 8px rgba(0,0,0,0.5)",
          }}>
            耶 稣 受 洗
          </div>
        </AbsoluteFill>

        {/* ===== Bible reference ===== */}
        <AbsoluteFill style={{ zIndex: 10 }}>
          <div style={{
            position: "absolute",
            bottom: "12%",
            width: "100%",
            textAlign: "center",
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Georgia, KaiTi, serif",
            letterSpacing: "0.2em",
          }}>
            马太福音 3:16-17
          </div>
        </AbsoluteFill>

        {/* ===== Bottom subtitles ===== */}
        {SUBTITLES.map((sub, i) => (
          <Sequence key={`sub-${i}`} from={sub.startFrame} durationInFrames={sub.endFrame - sub.startFrame}>
            <AbsoluteFill style={{ zIndex: 11 }}>
              <Subtitle text={sub.text} />
            </AbsoluteFill>
          </Sequence>
        ))}

        {/* ===== Divine voice large subtitle (scene 4) ===== */}
        <AbsoluteFill style={{ zIndex: 12, opacity: voiceOpacity }}>
          <div style={{
            position: "absolute",
            top: "40%",
            width: "100%",
            textAlign: "center",
            fontSize: 48,
            fontWeight: "bold",
            color: "#FFE8A0",
            fontFamily: "KaiTi, STKaiti, SimSun, serif",
            letterSpacing: "0.2em",
            textShadow: "0 0 40px rgba(255,220,100,0.8), 0 0 80px rgba(255,200,60,0.4), 0 4px 12px rgba(0,0,0,0.6)",
          }}>
            这是我的爱子，我所喜悦的
          </div>
        </AbsoluteFill>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

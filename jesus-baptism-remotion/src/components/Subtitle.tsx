import { useCurrentFrame, interpolate, Easing } from "remotion";

interface SubtitleProps {
  text: string;
}

export const Subtitle = ({ text }: SubtitleProps) => {
  const frame = useCurrentFrame();

  // Subtle glow pulse
  const glowPulse = Math.sin(frame * 0.06) * 0.2 + 0.8;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "5%",
        width: "100%",
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontSize: 26,
          fontFamily: "KaiTi, STKaiti, SimSun, serif",
          color: "#FFFFFF",
          letterSpacing: "0.15em",
          textShadow: `
            0 0 ${10 * glowPulse}px rgba(255,200,100,${0.5 * glowPulse}),
            0 0 ${20 * glowPulse}px rgba(255,180,60,${0.3 * glowPulse}),
            0 2px 6px rgba(0,0,0,0.8),
            0 0 2px rgba(0,0,0,0.9)
          `,
          padding: "10px 30px",
          background: "rgba(0,0,0,0.25)",
          borderRadius: "8px",
        }}
      >
        {text}
      </span>
    </div>
  );
};

import { useCurrentFrame } from "remotion";

export const LightRays = () => {
  const frame = useCurrentFrame();

  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
      <defs>
        {Array.from({ length: 9 }, (_, i) => (
          <linearGradient key={`rayGrad-${i}`} id={`rayGrad${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(255,245,200,${0.15 + (i % 3) * 0.05})`} />
            <stop offset="30%" stopColor={`rgba(255,230,160,${0.08 + (i % 2) * 0.04})`} />
            <stop offset="70%" stopColor={`rgba(255,210,120,${0.03})`} />
            <stop offset="100%" stopColor="rgba(255,180,80,0)" />
          </linearGradient>
        ))}
      </defs>

      {/* Source point: gap in clouds */}
      <circle cx="960" cy="90" r="60" fill="rgba(255,245,210,0.2)" />
      <circle cx="960" cy="90" r="30" fill="rgba(255,250,230,0.3)" />

      {/* Light rays fanning out */}
      {Array.from({ length: 9 }, (_, i) => {
        const angleSpread = -65 + (i / 8) * 130; // degrees from -65 to 65
        const angle = (angleSpread * Math.PI) / 180;
        const length = 750 + (i % 3) * 80;
        const x1 = 960;
        const y1 = 85;
        const x2 = 960 + Math.sin(angle) * length;
        const y2 = 85 + Math.cos(angle) * length;

        // Subtle animation
        const wobble = Math.sin(frame * 0.03 + i * 0.8) * 15;
        const alphaPulse = 0.7 + Math.sin(frame * 0.04 + i * 0.5) * 0.3;

        return (
          <g key={`ray-${i}`} opacity={alphaPulse}>
            <line x1={x1} y1={y1} x2={x2 + wobble} y2={y2}
              stroke={`rgba(255,240,180,${0.12 + (i % 3) * 0.03})`} strokeWidth={6 + (i % 4) * 3} />
            <line x1={x1} y1={y1} x2={x2 + wobble * 0.5} y2={y2}
              stroke={`rgba(255,245,200,${0.06})`} strokeWidth={12 + (i % 3) * 4} />
          </g>
        );
      })}
    </svg>
  );
};

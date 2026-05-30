import { useCurrentFrame } from "remotion";

export const River = () => {
  const frame = useCurrentFrame();

  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
      <defs>
        {/* River water gradient - deep blue-green */}
        <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#468298" />
          <stop offset="8%" stopColor="#3C738C" />
          <stop offset="30%" stopColor="#2D5F7D" />
          <stop offset="60%" stopColor="#1E4A66" />
          <stop offset="100%" stopColor="#143550" />
        </linearGradient>

        {/* Surface shimmer */}
        <linearGradient id="surfaceGlimmer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(180,210,230,0.4)" />
          <stop offset="30%" stopColor="rgba(140,185,210,0.15)" />
          <stop offset="100%" stopColor="rgba(80,130,160,0)" />
        </linearGradient>
      </defs>

      {/* River body */}
      <rect x="0" y="730" width="1920" height="350" fill="url(#riverGrad)" />

      {/* Riverbank transition */}
      <path d="M0,720 Q480,700 960,715 Q1440,730 1920,710 L1920,750 Q1440,770 960,755 Q480,740 0,760Z"
        fill="#5A6E3A" opacity="0.4" />

      {/* Water surface shimmer */}
      <rect x="0" y="730" width="1920" height="70" fill="url(#surfaceGlimmer)" />

      {/* Animated wave lines */}
      {Array.from({ length: 25 }, (_, i) => {
        const y = 740 + i * 12;
        const speed = 0.4 + (i % 5) * 0.15;
        const phase = frame * 0.04 * speed + i * 1.7;
        const opacity = 0.06 + (i % 4) * 0.02;
        const points = Array.from({ length: 40 }, (_, j) => {
          const px = j * 50;
          const py = y + Math.sin(px * 0.015 + phase) * 4;
          return `${px},${py}`;
        }).join(" ");
        return (
          <polyline key={`wave-${i}`} points={points} fill="none" stroke={`rgba(180,215,235,${opacity})`} strokeWidth="1.5" />
        );
      })}

      {/* Light reflections on water */}
      {Array.from({ length: 10 }, (_, i) => {
        const rx = 200 + i * 170 + Math.sin(frame * 0.02 + i * 1.3) * 30;
        const ry = 745 + (i % 5) * 18 + Math.cos(frame * 0.03 + i) * 8;
        const glowR = 25 + (i % 3) * 15;
        const alpha = 0.08 + Math.sin(frame * 0.04 + i * 0.7) * 0.04;
        return (
          <ellipse key={`glint-${i}`} cx={rx} cy={ry} rx={glowR} ry={glowR * 0.3} fill={`rgba(200,225,245,${alpha})`} />
        );
      })}
    </svg>
  );
};

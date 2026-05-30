import { useCurrentFrame, interpolate, Easing } from "remotion";

interface SkyProps {
  heavenGlow: number;
}

export const Sky = ({ heavenGlow }: SkyProps) => {
  const frame = useCurrentFrame();

  // Clouds parting animation
  const cloudLeftX = interpolate(frame, [0, 80, 160, 200], [0, 0, -60, -80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const cloudRightX = interpolate(frame, [0, 80, 160, 200], [0, 0, 60, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
      <defs>
        {/* Sky gradient */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B3A5C" />
          <stop offset="15%" stopColor="#3A6B8C" />
          <stop offset="30%" stopColor="#C49B55" />
          <stop offset="45%" stopColor="#E8BA60" />
          <stop offset="60%" stopColor="#D4A040" />
          <stop offset="100%" stopColor="#8B6B30" />
        </linearGradient>

        {/* Heaven glow filter */}
        <radialGradient id="heavenLight" cx="50%" cy="12%" r="25%">
          <stop offset="0%" stopColor={`rgba(255,240,200,${0.7 + heavenGlow * 0.3})`} />
          <stop offset="40%" stopColor={`rgba(255,220,150,${0.3 + heavenGlow * 0.2})`} />
          <stop offset="80%" stopColor={`rgba(255,200,100,${0.1 + heavenGlow * 0.1})`} />
          <stop offset="100%" stopColor="rgba(255,180,60,0)" />
        </radialGradient>

        {/* Cloud gradient */}
        <radialGradient id="cloudGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,252,245,0.95)" />
          <stop offset="40%" stopColor="rgba(255,248,235,0.7)" />
          <stop offset="70%" stopColor="rgba(255,240,220,0.3)" />
          <stop offset="100%" stopColor="rgba(255,235,210,0)" />
        </radialGradient>

        {/* Golden hour rim light on clouds */}
        <filter id="cloudGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft blur for background */}
        <filter id="softBlur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Sky background */}
      <rect width="1920" height="1080" fill="url(#skyGrad)" />

      {/* Heaven glow overlay */}
      <rect width="1920" height="1080" fill="url(#heavenLight)" />

      {/* ===== Left-side clouds ===== */}
      <g filter="url(#cloudGlow)" transform={`translate(${cloudLeftX}, 0)`}>
        {/* Large cloud mass */}
        <ellipse cx="200" cy="100" rx="180" ry="45" fill="url(#cloudGrad)" />
        <ellipse cx="350" cy="80" rx="150" ry="50" fill="url(#cloudGrad)" />
        <ellipse cx="500" cy="105" rx="170" ry="40" fill="url(#cloudGrad)" />
        <ellipse cx="280" cy="125" rx="200" ry="35" fill="url(#cloudGrad)" opacity="0.6" />
        <ellipse cx="600" cy="70" rx="130" ry="45" fill="url(#cloudGrad)" opacity="0.5" />
        <ellipse cx="100" cy="130" rx="140" ry="30" fill="url(#cloudGrad)" opacity="0.4" />
      </g>

      {/* ===== Right-side clouds ===== */}
      <g filter="url(#cloudGlow)" transform={`translate(${cloudRightX}, 0)`}>
        <ellipse cx="1700" cy="95" rx="160" ry="48" fill="url(#cloudGrad)" />
        <ellipse cx="1550" cy="75" rx="140" ry="45" fill="url(#cloudGrad)" />
        <ellipse cx="1400" cy="110" rx="180" ry="38" fill="url(#cloudGrad)" />
        <ellipse cx="1650" cy="120" rx="190" ry="35" fill="url(#cloudGrad)" opacity="0.6" />
        <ellipse cx="1800" cy="65" rx="120" ry="40" fill="url(#cloudGrad)" opacity="0.5" />
      </g>

      {/* ===== Small accent clouds ===== */}
      <ellipse cx="750" cy="60" rx="100" ry="25" fill="url(#cloudGrad)" opacity="0.5" />
      <ellipse cx="1100" cy="50" rx="90" ry="22" fill="url(#cloudGrad)" opacity="0.4" />
      <ellipse cx="1300" cy="80" rx="110" ry="28" fill="url(#cloudGrad)" opacity="0.3" />
    </svg>
  );
};

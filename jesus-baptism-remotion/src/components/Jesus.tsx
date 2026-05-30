import { useCurrentFrame, interpolate } from "remotion";

export const Jesus = () => {
  const frame = useCurrentFrame();

  // Gentle body sway (standing in water)
  const swayX = Math.sin(frame * 0.06) * 2;
  const swayY = Math.sin(frame * 0.04) * 1;

  // Eyes closing in reverence
  const eyeClose = interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
      <defs>
        {/* Skin tone gradient */}
        <radialGradient id="jesusSkin" cx="50%" cy="35%">
          <stop offset="0%" stopColor="#E8C8A0" />
          <stop offset="60%" stopColor="#D4B08A" />
          <stop offset="100%" stopColor="#C4A078" />
        </radialGradient>

        {/* White robe gradient */}
        <linearGradient id="jesusRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF8F2" />
          <stop offset="20%" stopColor="#F0EBE0" />
          <stop offset="60%" stopColor="#E5DECC" />
          <stop offset="100%" stopColor="#D5CCB0" />
        </linearGradient>

        {/* Halo glow */}
        <radialGradient id="haloGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(255,220,120,0.4)" />
          <stop offset="60%" stopColor="rgba(255,200,100,0.15)" />
          <stop offset="100%" stopColor="rgba(255,180,60,0)" />
        </radialGradient>

        {/* Hair gradient */}
        <linearGradient id="jesusHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A2A10" />
          <stop offset="50%" stopColor="#3A2010" />
          <stop offset="100%" stopColor="#5A3A20" />
        </linearGradient>
      </defs>

      <g transform={`translate(${820 + swayX}, ${590 + swayY})`}>
        {/* ===== Halo ===== */}
        <ellipse cx="0" cy="-105" rx="42" ry="42" fill="url(#haloGlow)" />
        <ellipse cx="0" cy="-105" rx="38" ry="38" fill="none" stroke="rgba(255,215,100,0.4)" strokeWidth="1.5">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* ===== Body (white robe, lower half visible above water) ===== */}
        <path
          d="M-30,-20 Q-28,-15 -32,50 Q-30,80 -26,120 Q0,135 26,120 Q30,80 32,50 Q28,-15 30,-20Z"
          fill="url(#jesusRobe)"
        />

        {/* Robe fold lines */}
        <line x1="-15" y1="-10" x2="-18" y2="100" stroke="rgba(180,170,155,0.3)" strokeWidth="1" />
        <line x1="0" y1="-15" x2="-2" y2="110" stroke="rgba(180,170,155,0.2)" strokeWidth="1" />
        <line x1="14" y1="-8" x2="16" y2="95" stroke="rgba(180,170,155,0.25)" strokeWidth="1" />

        {/* ===== Head ===== */}
        <ellipse cx="0" cy="-70" rx="24" ry="28" fill="url(#jesusSkin)" />

        {/* ===== Hair ===== */}
        {/* Back hair flowing down */}
        <path d="M-24,-70 Q-26,-80 -20,-85 Q0,-95 20,-85 Q26,-80 24,-70 Q26,-55 22,-50 Q0,-45 -22,-50 Q-26,-55 -24,-70Z"
          fill="url(#jesusHair)" opacity="0.9" />
        {/* Side hair */}
        <path d="M-22,-65 Q-28,-60 -26,-50 Q-24,-45 -20,-48Z" fill="#3A1A08" />
        <path d="M22,-65 Q28,-60 26,-50 Q24,-45 20,-48Z" fill="#3A1A08" />
        {/* Top hair volume */}
        <ellipse cx="0" cy="-88" rx="20" ry="10" fill="#3A1A08" />

        {/* ===== Facial features ===== */}
        {/* Eyebrows */}
        <path d="M-10,-64 Q-6,-67 -2,-64" fill="none" stroke="#4A2810" strokeWidth="1.5" />
        <path d="M2,-64 Q6,-67 10,-64" fill="none" stroke="#4A2810" strokeWidth="1.5" />

        {/* Eyes (closing in reverence) */}
        <g>
          {/* Left eye */}
          <ellipse cx="-7" cy="-59" rx="3" ry={1.5 - eyeClose * 1.2} fill="#2A1005" />
          {/* Right eye */}
          <ellipse cx="7" cy="-59" rx="3" ry={1.5 - eyeClose * 1.2} fill="#2A1005" />
        </g>

        {/* Nose */}
        <path d="M0,-56 L0,-49 L2,-48" fill="none" stroke="rgba(180,140,110,0.5)" strokeWidth="1.5" />

        {/* Beard */}
        <path d="M-12,-48 Q-10,-40 -5,-35 Q0,-30 5,-35 Q10,-40 12,-48 Q8,-44 0,-43 Q-8,-44 -12,-48Z"
          fill="#4A2810" />
        {/* Beard wisps */}
        <path d="M-8,-40 Q-10,-32 -7,-28" fill="none" stroke="#4A2810" strokeWidth="2" />
        <path d="M0,-35 L-1,-28" fill="none" stroke="#4A2810" strokeWidth="2" />
        <path d="M8,-40 Q10,-32 7,-28" fill="none" stroke="#4A2810" strokeWidth="2" />

        {/* Slight mouth line */}
        <line x1="-4" y1="-45" x2="4" y2="-45" stroke="rgba(140,100,70,0.4)" strokeWidth="1" />

        {/* ===== Water surface ripple around Jesus ===== */}
        <ellipse cx="0" cy="55" rx="40" ry="8" fill="none" stroke="rgba(160,210,235,0.3)" strokeWidth="1.5">
          <animate attributeName="rx" values="38;42;38" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="0" cy="55" rx="50" ry="10" fill="none" stroke="rgba(160,210,235,0.15)" strokeWidth="1">
          <animate attributeName="rx" values="48;54;48" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
      </g>
    </svg>
  );
};

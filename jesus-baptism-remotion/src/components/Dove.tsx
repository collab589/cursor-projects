import { useCurrentFrame, interpolate, Easing } from "remotion";

export const Dove = () => {
  const frame = useCurrentFrame();

  // Dove descends from gap in clouds to just above Jesus
  const progress = interpolate(frame, [0, 50, 65], [0, 0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // After reaching destination, gentle hover
  const hoverY = frame > 60 ? Math.sin((frame - 60) * 0.06) * 5 : 0;
  const hoverX = frame > 60 ? Math.cos((frame - 60) * 0.04) * 8 : 0;

  // Wing flap
  const wingAngle = Math.sin(frame * 0.7) * 25 * (1 - progress * 0.4);
  const wingAngle2 = Math.sin(frame * 0.7 + Math.PI) * 15 * (1 - progress * 0.4);

  // Starting position (cloud gap) to ending position (above Jesus)
  const startX = 960;
  const startY = 110;
  const endX = 850;
  const endY = 480;

  const cx = startX + (endX - startX) * progress + hoverX;
  const cy = startY + (endY - startY) * progress + hoverY;

  // Opacity fade in
  const opacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow around dove
  const glowOpacity = 0.2 + Math.sin(frame * 0.05) * 0.1;

  if (progress <= 0) return null;

  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="doveGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor={`rgba(255,240,200,${glowOpacity + 0.3})`} />
          <stop offset="40%" stopColor={`rgba(255,230,180,${glowOpacity + 0.15})`} />
          <stop offset="70%" stopColor={`rgba(255,220,150,${glowOpacity + 0.05})`} />
          <stop offset="100%" stopColor="rgba(255,200,100,0)" />
        </radialGradient>

        <radialGradient id="doveBody" cx="50%" cy="45%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F2F2F2" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </radialGradient>

        <radialGradient id="doveHead" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F5F5" />
        </radialGradient>
      </defs>

      <g transform={`translate(${cx}, ${cy})`} opacity={opacity}>
        {/* ===== Spiritual glow ===== */}
        <ellipse cx="0" cy="0" rx="45" ry="45" fill="url(#doveGlow)" />

        {/* ===== Body ===== */}
        <g>
          {/* Main body ellipse */}
          <ellipse cx="0" cy="0" rx="20" ry="11" fill="url(#doveBody)" />

          {/* Left wing (behind) */}
          <g transform={`rotate(${wingAngle2}, 3, -2)`}>
            <path d="M3,-2 Q-8,-18 -15,-12 Q-12,-4 0,-2Z" fill="#E8E8E8" />
          </g>

          {/* Right wing (front) */}
          <g transform={`rotate(${wingAngle}, 3, -2)`}>
            <path d="M3,-2 Q-5,-20 -12,-14 Q-10,-5 0,-2Z" fill="#F0F0F0" />
          </g>

          {/* Head */}
          <ellipse cx="16" cy="-3" rx="10" ry="8" fill="url(#doveHead)" />

          {/* Eye */}
          <circle cx="19" cy="-4" r="1.2" fill="#3A2010" />
          <circle cx="19.3" cy="-4.3" r="0.4" fill="white" />

          {/* Beak */}
          <path d="M25,-3 L30,-1.5 L25,0Z" fill="#E8A840" />

          {/* Tail */}
          <path d="M-20,0 Q-26,2 -28,5 Q-24,3 -20,2Z" fill="#E8E8E8" />
          <path d="M-18,2 Q-25,5 -26,8 Q-22,5 -18,3Z" fill="#E0E0E0" />

          {/* ===== Light rays emanating from dove ===== */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const rayLen = 25 + Math.sin(frame * 0.05 + i) * 5;
            const x1 = Math.cos(angle) * 18;
            const y1 = Math.sin(angle) * 10;
            const x2 = Math.cos(angle) * rayLen;
            const y2 = Math.sin(angle) * rayLen * 0.7;
            return (
              <line key={`ray-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,230,170,0.2)" strokeWidth="1" />
            );
          })}
        </g>
      </g>
    </svg>
  );
};

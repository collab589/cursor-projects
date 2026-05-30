import { useCurrentFrame, interpolate } from "remotion";

export const John = () => {
  const frame = useCurrentFrame();

  // Arm sway for pouring water
  const armAngle = Math.sin(frame * 0.08) * 3;

  // Water drops
  const dropPhase = frame * 3;

  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="johnSkin" cx="50%" cy="35%">
          <stop offset="0%" stopColor="#D4B898" />
          <stop offset="60%" stopColor="#C4A080" />
          <stop offset="100%" stopColor="#B09070" />
        </radialGradient>
        <linearGradient id="johnRobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4A070" />
          <stop offset="20%" stopColor="#B09060" />
          <stop offset="60%" stopColor="#987048" />
          <stop offset="100%" stopColor="#806038" />
        </linearGradient>
        <linearGradient id="johnHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A1A08" />
          <stop offset="60%" stopColor="#3A2818" />
          <stop offset="100%" stopColor="#4A3828" />
        </linearGradient>
      </defs>

      <g transform="translate(720, 600)">
        {/* ===== Body (camel hair robe) ===== */}
        <path d="M-28,-15 Q-26,-10 -28,45 Q-26,70 -22,110 Q0,125 22,110 Q26,70 28,45 Q26,-10 28,-15Z"
          fill="url(#johnRobe)" />

        {/* Robe texture */}
        <line x1="-14" y1="-5" x2="-16" y2="95" stroke="rgba(139,100,60,0.3)" strokeWidth="1" />
        <line x1="0" y1="-10" x2="-2" y2="105" stroke="rgba(139,100,60,0.2)" strokeWidth="1" />
        <line x1="14" y1="-3" x2="15" y2="90" stroke="rgba(139,100,60,0.25)" strokeWidth="1" />

        {/* ===== Head ===== */}
        <ellipse cx="0" cy="-65" rx="22" ry="26" fill="url(#johnSkin)" />

        {/* ===== Wild, unkempt hair ===== */}
        <path d="M-22,-65 Q-24,-78 -16,-85 Q-5,-95 8,-90 Q16,-88 22,-80 Q24,-75 22,-65 Q24,-52 20,-45 Q10,-40 0,-40 Q-10,-40 -20,-45 Q-24,-52 -22,-65Z"
          fill="url(#johnHair)" opacity="0.9" />
        {/* Messy hair wisps */}
        <path d="M-20,-82 Q-28,-88 -24,-92" fill="none" stroke="#2A1A08" strokeWidth="2" />
        <path d="M5,-90 Q8,-96 12,-94" fill="none" stroke="#2A1A08" strokeWidth="2" />
        <path d="M18,-82 Q26,-86 22,-92" fill="none" stroke="#2A1A08" strokeWidth="1.5" />

        {/* ===== Facial features ===== */}
        {/* Bushy eyebrows */}
        <path d="M-12,-60 Q-8,-63 -3,-60" fill="none" stroke="#3A2010" strokeWidth="2" />
        <path d="M3,-60 Q8,-63 12,-60" fill="none" stroke="#3A2010" strokeWidth="2" />

        {/* Eyes */}
        <ellipse cx="-6" cy="-55" rx="2.5" ry="1.2" fill="#1A0800" />
        <ellipse cx="6" cy="-55" rx="2.5" ry="1.2" fill="#1A0800" />

        {/* Nose */}
        <path d="M0,-52 L0,-45 L2,-44" fill="none" stroke="rgba(160,120,90,0.5)" strokeWidth="1.5" />

        {/* Full beard */}
        <path d="M-14,-44 Q-12,-35 -8,-28 Q-3,-20 0,-18 Q3,-20 8,-28 Q12,-35 14,-44 Q8,-40 0,-39 Q-8,-40 -14,-44Z"
          fill="#3A2010" />
        {/* More beard volume */}
        <path d="M-10,-35 Q-8,-25 -4,-22" fill="none" stroke="#3A2010" strokeWidth="2.5" />
        <path d="M0,-30 L0,-22" fill="none" stroke="#3A2010" strokeWidth="2.5" />
        <path d="M10,-35 Q8,-25 4,-22" fill="none" stroke="#3A2010" strokeWidth="2.5" />

        {/* Mouth */}
        <line x1="-4" y1="-41" x2="4" y2="-41" stroke="rgba(120,85,60,0.5)" strokeWidth="1.2" />

        {/* ===== Right arm extended to Jesus (pouring water) ===== */}
        <g transform={`rotate(${armAngle}, 22, -50)`}>
          <path d="M22,-50 Q50,-52 80,-48 Q100,-45 120,-42 Q110,-35 80,-38 Q50,-42 22,-40Z"
            fill="url(#johnSkin)" opacity="0.9" />

          {/* Hand at end of arm */}
          <ellipse cx="120" cy="-42" rx="9" ry="7" fill="#D4B898" />

          {/* ===== Water stream from hand ===== */}
          <g>
            {/* Water strand */}
            <path d="M120,-35 Q118,-20 119,-5 Q120,10 118,25" fill="none" stroke="rgba(140,200,230,0.5)" strokeWidth="3">
              <animate attributeName="stroke-opacity" values="0.5;0.7;0.5" dur="0.8s" repeatCount="indefinite" />
            </path>
            <path d="M122,-35 Q124,-22 122,-8 Q120,8 121,20" fill="none" stroke="rgba(160,210,235,0.4)" strokeWidth="2">
              <animate attributeName="stroke-opacity" values="0.4;0.6;0.4" dur="0.7s" repeatCount="indefinite" />
            </path>

            {/* Water drops falling */}
            {[0, 1, 2, 3, 4].map((i) => {
              const dropY = ((dropPhase + i * 12) % 35) - 5;
              const dropX = 118 + (i % 3 - 1) * 3;
              const dropAlpha = 0.6 * (1 - dropY / 35);
              if (dropY < -5) return null;
              return (
                <ellipse key={`drop-${i}`} cx={dropX} cy={dropY} rx="2" ry="4" fill={`rgba(160,215,240,${dropAlpha})`} />
              );
            })}
          </g>
        </g>
      </g>
    </svg>
  );
};

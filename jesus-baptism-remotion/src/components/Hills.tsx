import { useCurrentFrame } from "remotion";

export const Hills = () => {
  const frame = useCurrentFrame();

  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="hillGradL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7B8E5A" />
          <stop offset="40%" stopColor="#5C7A3A" />
          <stop offset="100%" stopColor="#3A5520" />
        </linearGradient>
        <linearGradient id="hillGradR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B7E4A" />
          <stop offset="40%" stopColor="#4A6A2A" />
          <stop offset="100%" stopColor="#2A4A18" />
        </linearGradient>
        <radialGradient id="treeCanopy" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#8B9E5A" />
          <stop offset="50%" stopColor="#5C7E30" />
          <stop offset="100%" stopColor="#3A5A18" />
        </radialGradient>
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6B3A" />
          <stop offset="50%" stopColor="#6B4B20" />
          <stop offset="100%" stopColor="#4A3010" />
        </linearGradient>
      </defs>

      {/* Left hill */}
      <path d="M-50,1080 Q100,650 400,680 Q580,700 700,750 Q780,780 850,1080Z" fill="url(#hillGradL)" opacity="0.9" />

      {/* Right hill */}
      <path d="M750,1080 Q900,700 1150,670 Q1350,640 1550,710 Q1750,770 1970,720 L1970,1080Z" fill="url(#hillGradR)" opacity="0.85" />

      {/* Hill vegetation texture - scattered tree canopies */}
      {Array.from({ length: 25 }, (_, i) => {
        const x = 100 + i * 72 + Math.sin(i * 1.8) * 20;
        const y = 680 + Math.sin(i * 0.7) * 60 + (i % 3) * 20;
        const r = 22 + (i % 4) * 10;
        return (
          <ellipse key={`tree-${i}`} cx={x} cy={y} rx={r} ry={r * 0.8} fill="url(#treeCanopy)" opacity={0.7 + (i % 3) * 0.1} />
        );
      })}

      {/* Individual foreground trees (olive trees) */}
      <g>
        {/* Tree 1 */}
        <rect x="145" y="720" width="10" height="70" rx="4" fill="url(#trunkGrad)" />
        <ellipse cx="150" cy="700" rx="50" ry="40" fill="url(#treeCanopy)" />

        {/* Tree 2 */}
        <rect x="320" y="730" width="8" height="55" rx="3" fill="url(#trunkGrad)" />
        <ellipse cx="324" cy="710" rx="40" ry="35" fill="url(#treeCanopy)" />

        {/* Tree 3 */}
        <rect x="1380" y="710" width="9" height="65" rx="4" fill="url(#trunkGrad)" />
        <ellipse cx="1385" cy="690" rx="45" ry="38" fill="url(#treeCanopy)" />

        {/* Tree 4 */}
        <rect x="1580" y="725" width="8" height="55" rx="3" fill="url(#trunkGrad)" />
        <ellipse cx="1584" cy="705" rx="38" ry="33" fill="url(#treeCanopy)" />

        {/* Tree 5 */}
        <rect x="1680" y="730" width="7" height="50" rx="3" fill="url(#trunkGrad)" />
        <ellipse cx="1684" cy="715" rx="35" ry="30" fill="url(#treeCanopy)" />
      </g>

      {/* Reeds on left bank */}
      {Array.from({ length: 12 }, (_, i) => {
        const rx = 60 + i * 18;
        const swayAngle = Math.sin(frame * 0.03 + i * 0.6) * 3;
        const h = 60 + (i % 4) * 20;
        return (
          <g key={`reed-l-${i}`} transform={`rotate(${swayAngle}, ${rx}, 790)`}>
            <rect x={rx} y={790 - h} width="2.5" height={h} rx="1" fill="#6B8A3A" opacity="0.85" />
            <ellipse cx={rx + 1} cy={790 - h - 3} rx="5" ry="8" fill="#7B9A4A" opacity="0.7" />
          </g>
        );
      })}

      {/* Reeds on right bank */}
      {Array.from({ length: 12 }, (_, i) => {
        const rx = 1740 + i * 18;
        const swayAngle = Math.sin(frame * 0.03 + i * 0.6 + 1) * 3;
        const h = 55 + (i % 3) * 18;
        return (
          <g key={`reed-r-${i}`} transform={`rotate(${swayAngle}, ${rx}, 790)`}>
            <rect x={rx} y={790 - h} width="2.5" height={h} rx="1" fill="#6B8A3A" opacity="0.8" />
            <ellipse cx={rx + 1} cy={790 - h - 3} rx="5" ry="8" fill="#7B9A4A" opacity="0.65" />
          </g>
        );
      })}
    </svg>
  );
};

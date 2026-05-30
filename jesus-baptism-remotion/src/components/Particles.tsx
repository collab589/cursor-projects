import { useCurrentFrame } from "remotion";

// Deterministic pseudo-random for consistent rendering
function hash(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface ParticleData {
  baseX: number;
  speed: number;
  size: number;
  opacity: number;
  wobbleAmp: number;
  wobbleFreq: number;
  lifeCycle: number;
  lifeOffset: number;
}

// Pre-compute particle properties (deterministic)
const PARTICLE_COUNT = 50;
const particles: ParticleData[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  baseX: 960 + (hash(i * 3) - 0.35) * 500,
  speed: 0.4 + hash(i * 7 + 1) * 0.8,
  size: 1.5 + hash(i * 11 + 2) * 2.5,
  opacity: 0.3 + hash(i * 13 + 3) * 0.6,
  wobbleAmp: hash(i * 17 + 4) * 20,
  wobbleFreq: 0.02 + hash(i * 19 + 5) * 0.04,
  lifeCycle: 120 + hash(i * 23 + 6) * 80,
  lifeOffset: hash(i * 29 + 7),
}));

export const Particles = () => {
  const frame = useCurrentFrame();

  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
      {particles.map((p, i) => {
        // Particle cycles through a life
        const lifeProgress = ((frame * p.speed + p.lifeCycle * p.lifeOffset) % p.lifeCycle) / p.lifeCycle;
        // Fade in and out
        const alpha = Math.sin(lifeProgress * Math.PI) * p.opacity;

        if (alpha < 0.01) return null;

        const y = 85 + lifeProgress * 600;
        const x = p.baseX + Math.sin(frame * p.wobbleFreq + i) * p.wobbleAmp;

        return (
          <g key={`p-${i}`}>
            {/* Main particle */}
            <circle cx={x} cy={y} r={p.size} fill={`rgba(255,245,200,${alpha})`} />
            {/* Glow */}
            <circle cx={x} cy={y} r={p.size * 2.5} fill={`rgba(255,240,180,${alpha * 0.3})`} />
          </g>
        );
      })}
    </svg>
  );
};

import { anton } from "../fonts";

/**
 * Original rear-view speedboat illustration (SVG). Anchor = waterline centre.
 * viewBox 700x520, waterline at y=440.
 */
export const Speedboat: React.FC<{ x: number; y: number; scale: number; tilt?: number; opacity?: number; foam?: number }> = ({
  x,
  y,
  scale,
  tilt = 0,
  opacity = 1,
  foam = 1,
}) => {
  const W = 700;
  const H = 520;
  const motors = [205, 495];
  return (
    <svg
      width={W * scale}
      height={H * scale}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: "absolute",
        left: x - 350 * scale,
        top: y - 440 * scale,
        transform: `rotate(${tilt}deg)`,
        transformOrigin: `${350 * scale}px ${440 * scale}px`,
        opacity,
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="sb-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#eef1f5" />
          <stop offset="1" stopColor="#c3cbd5" />
        </linearGradient>
        <linearGradient id="sb-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1520" />
          <stop offset="1" stopColor="#3a4c62" />
        </linearGradient>
        <linearGradient id="sb-chrome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f99a6" />
          <stop offset="0.35" stopColor="#ffffff" />
          <stop offset="0.65" stopColor="#8a94a0" />
          <stop offset="1" stopColor="#e8edf2" />
        </linearGradient>
        <linearGradient id="sb-tail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d0b16" />
          <stop offset="0.5" stopColor="#ff4d4d" />
          <stop offset="1" stopColor="#8d0b16" />
        </linearGradient>
        <linearGradient id="sb-sink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(40,120,160,0)" />
          <stop offset="0.25" stopColor="rgba(30,105,145,0.85)" />
          <stop offset="1" stopColor="rgba(15,75,115,0.95)" />
        </linearGradient>
        <filter id="sb-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* T-top arch */}
      <path d="M190 252 L232 74 L468 74 L510 252" stroke="#f4f6f8" strokeWidth={18} fill="none" strokeLinejoin="round" />
      <path d="M190 252 L232 74 L468 74 L510 252" stroke="#b9c2cc" strokeWidth={4} fill="none" strokeLinejoin="round" />
      <rect x={212} y={50} width={276} height={32} rx={13} fill="#ffffff" stroke="#c3cbd5" strokeWidth={3} />
      <rect x={232} y={60} width={236} height={8} rx={4} fill="#FF3D7F" />
      <line x1={300} y1={50} x2={292} y2={8} stroke="#d8dde3" strokeWidth={5} strokeLinecap="round" />
      <line x1={410} y1={50} x2={420} y2={18} stroke="#d8dde3" strokeWidth={5} strokeLinecap="round" />
      <circle cx={350} cy={44} r={9} fill="#22D3EE" />

      {/* cabin + windshield */}
      <path d="M150 256 L214 140 L486 140 L550 256 Z" fill="url(#sb-glass)" />
      <path d="M232 150 L300 150 L238 246 L176 246 Z" fill="rgba(255,255,255,0.18)" />
      <path d="M330 150 L352 150 L296 246 L274 246 Z" fill="rgba(255,255,255,0.10)" />
      <path d="M150 256 L214 140 L486 140 L550 256" stroke="url(#sb-chrome)" strokeWidth={7} fill="none" strokeLinejoin="round" />
      {/* captain silhouette */}
      <circle cx={392} cy={196} r={20} fill="#0a0f16" />
      <path d="M362 256 Q392 210 422 256 Z" fill="#0a0f16" />

      {/* deck rim */}
      <rect x={66} y={248} width={568} height={20} rx={10} fill="#dfe4ea" />
      <rect x={66} y={248} width={568} height={5} rx={3} fill="url(#sb-chrome)" />

      {/* hull / transom */}
      <path d="M60 264 L640 264 L612 402 Q350 474 88 402 Z" fill="url(#sb-hull)" stroke="#aab3be" strokeWidth={3} />
      <path d="M67 300 L633 300 L628 324 L72 324 Z" fill="#0B2545" />
      <path d="M73 331 L627 331 L625 339 L75 339 Z" fill="#FF3D7F" />

      {/* Velfire-style tail lights */}
      <rect x={80} y={272} width={96} height={20} rx={8} fill="url(#sb-tail)" />
      <rect x={524} y={272} width={96} height={20} rx={8} fill="url(#sb-tail)" />
      <rect x={80} y={272} width={96} height={20} rx={8} fill="#ff5a5a" opacity={0.6} filter="url(#sb-blur)" />
      <rect x={524} y={272} width={96} height={20} rx={8} fill="#ff5a5a" opacity={0.6} filter="url(#sb-blur)" />

      {/* name + plate */}
      <text x={350} y={382} textAnchor="middle" fontFamily={anton} fontSize={44} fill="#0B2545" letterSpacing={7}>
        VELFIRE
      </text>
      <rect x={302} y={391} width={96} height={26} rx={4} fill="#111" stroke="#666" strokeWidth={2} />
      <text x={350} y={411} textAnchor="middle" fontFamily={anton} fontSize={19} fill="#fff" letterSpacing={2}>
        FAI1218
      </text>

      {/* twin outboard motors */}
      {motors.map((mx) => (
        <g key={mx}>
          <rect x={mx - 12} y={400} width={24} height={64} rx={6} fill="#2a2e35" />
          <rect x={mx - 33} y={342} width={66} height={74} rx={24} fill="#17191e" />
          <rect x={mx - 28} y={352} width={56} height={9} rx={4} fill="url(#sb-chrome)" />
          <rect x={mx - 20} y={372} width={40} height={4} rx={2} fill="#FF3D7F" />
        </g>
      ))}

      {/* submerged part + waterline foam */}
      <rect x={20} y={432} width={660} height={100} fill="url(#sb-sink)" />
      <ellipse cx={350} cy={440} rx={300} ry={15} fill="#ffffff" opacity={0.85 * foam} filter="url(#sb-blur)" />
      <ellipse cx={350} cy={440} rx={250} ry={8} fill="#ffffff" opacity={0.9 * foam} />
    </svg>
  );
};

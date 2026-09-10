type Props = { value: number; label?: string; size?: number };

export default function CircularGauge({ value, label = "Readiness", size = 180 }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  const radius = 78;
  const stroke = 10;
  const norm = radius;
  const circumference = 2 * Math.PI * norm;
  // 270 deg arc (from 135 to 405) — classic gauge, 75% circle
  const arcLen = circumference * 0.75;
  const offset = arcLen - (pct / 100) * arcLen;

  return (
    <div className="flex flex-col items-center gap-3" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 200 200" className="block">
          {/* track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#22282D"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circumference}`}
            transform="rotate(135 100 100)"
          />
          {/* progress */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#2ED9A0"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={offset}
            transform="rotate(135 100 100)"
            style={{ filter: "drop-shadow(0 0 8px rgba(46,217,160,0.35))", transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[42px] font-semibold leading-none tracking-tight text-textPrimary">
            {value}
          </span>
          <span className="font-mono text-[11px] tracking-[0.18em] text-textMuted -mt-1">/ 100</span>
          <span className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-emeraldAccent uppercase">{label}</span>
        </div>
      </div>
    </div>
  );
}

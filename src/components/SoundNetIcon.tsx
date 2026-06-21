export function SoundNetIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="28" r="22" stroke="currentColor" strokeWidth="2.5" opacity="0.9" />
      <path d="M10 28 H54 M32 6 V50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M16 14 Q32 22 48 14 M16 42 Q32 34 48 42" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M14 22 Q32 30 50 22 M14 34 Q32 26 50 34" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x = 32 + Math.cos(rad) * 22
        const y = 28 + Math.sin(rad) * 22
        return <circle key={deg} cx={x} cy={y} r="2.5" fill="#ef4444" />
      })}
      <path d="M32 50 C28 56 24 58 20 60" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

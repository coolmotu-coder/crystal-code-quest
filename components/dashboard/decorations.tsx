export function CrystalPreviewVisual({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex h-48 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 sm:h-full ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Distant crystal glow */}
      <div className="from-cyan-500/10 to-violet-500/10 absolute inset-0 bg-gradient-to-br via-transparent" />
      <div className="bg-cyan-400/10 absolute left-1/4 top-1/3 h-24 w-24 rounded-full blur-2xl" />
      <div className="bg-violet-500/10 absolute bottom-1/4 right-1/4 h-28 w-28 rounded-full blur-2xl" />

      {/* Ground line */}
      <div className="absolute bottom-12 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Crystal silhouette */}
      <svg viewBox="0 0 200 120" fill="none" className="relative h-32 w-56 sm:h-40 sm:w-72">
        <path
          d="M70 90L85 45L100 25L115 45L130 90H70Z"
          fill="url(#crystalGradient)"
          fillOpacity="0.25"
          stroke="url(#crystalGradient)"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <path
          d="M100 25L100 90M85 45L115 45M75 75H125"
          stroke="url(#crystalGradient)"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        {/* Obstacle */}
        <rect
          x="140"
          y="70"
          width="28"
          height="20"
          rx="2"
          fill="#2a2a2a"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <rect
          x="145"
          y="65"
          width="18"
          height="8"
          rx="1"
          fill="#2a2a2a"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <defs>
          <linearGradient
            id="crystalGradient"
            x1="0"
            y1="0"
            x2="200"
            y2="120"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>

      {/* Sparkle dots */}
      <div className="bg-cyan-200/60 absolute left-[20%] top-[25%] h-1 w-1 rounded-full" />
      <div className="bg-violet-200/50 absolute right-[25%] top-[20%] h-1.5 w-1.5 rounded-full" />
      <div className="absolute bottom-[30%] left-[30%] h-1 w-1 rounded-full bg-white/40" />
    </div>
  );
}

export function QuestHeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={`border-cyan-300/10 via-cyan-950/20 relative flex h-40 items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br from-slate-950/70 to-slate-950/70 sm:h-48 ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="from-cyan-400/5 absolute inset-0 bg-gradient-to-br to-transparent" />
      <svg viewBox="0 0 160 120" fill="none" className="relative h-28 w-40 sm:h-32 sm:w-48">
        {/* Robot / character head */}
        <rect
          x="55"
          y="25"
          width="50"
          height="46"
          rx="8"
          fill="#2a2a2a"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        <circle cx="70" cy="45" r="4" fill="#22d3ee" fillOpacity="0.6" />
        <circle cx="90" cy="45" r="4" fill="#22d3ee" fillOpacity="0.6" />
        <rect x="68" y="56" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
        {/* Antenna */}
        <line
          x1="80"
          y1="25"
          x2="80"
          y2="12"
          stroke="#22d3ee"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <circle cx="80" cy="10" r="3" fill="#22d3ee" fillOpacity="0.4" />
        {/* Body */}
        <rect
          x="62"
          y="73"
          width="36"
          height="28"
          rx="4"
          fill="#2a2a2a"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        {/* Crystal near character */}
        <path
          d="M120 85L130 55L140 85H120Z"
          fill="url(#heroCrystalGradient)"
          fillOpacity="0.25"
          stroke="url(#heroCrystalGradient)"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <defs>
          <linearGradient
            id="heroCrystalGradient"
            x1="120"
            y1="55"
            x2="140"
            y2="85"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function ConceptIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3C12 3 6 8 6 12C6 15 8 18 12 18C16 18 18 15 18 12C18 8 12 3 12 3Z" />
      <path d="M9 12H15" />
      <path d="M12 9V15" />
      <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

export function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C8 2 5 5 5 9C5 12 7 14 8 15V17C8 18 9 19 10 19H14C15 19 16 18 16 17V15C17 14 19 12 19 9C19 5 16 2 12 2Z" />
      <path d="M10 19V21H14V19" />
    </svg>
  );
}

export function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3L14 9H20L15 13L17 19L12 15L7 19L9 13L4 9H10L12 3Z" />
    </svg>
  );
}

export function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 19.5C4 18.5 5 18 6 18C8 18 10 19 12 19C14 19 16 18 18 18C19 18 20 18.5 20 19.5V5C20 4 19 3.5 18 3.5C16 3.5 14 4.5 12 4.5C10 4.5 8 3.5 6 3.5C5 3.5 4 4 4 5V19.5Z" />
      <path d="M12 4.5V19" />
    </svg>
  );
}

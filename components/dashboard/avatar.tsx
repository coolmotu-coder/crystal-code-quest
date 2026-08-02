import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GuideAvatar({ className, alt }: { className?: string; alt: string }) {
  return (
    <svg
      role="img"
      aria-label={alt}
      className={cn("h-full w-full", className)}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="guideGradient"
          x1="0"
          y1="0"
          x2="120"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="12" fill="url(#guideGradient)" fillOpacity="0.18" />
      <circle
        cx="60"
        cy="44"
        r="24"
        fill="#2a3a3a"
        stroke="url(#guideGradient)"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />
      <path
        d="M36 44C36 30.75 46.75 20 60 20C73.25 20 84 30.75 84 44C84 57.25 73.25 68 60 68C46.75 68 36 57.25 36 44Z"
        stroke="url(#guideGradient)"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <circle cx="52" cy="40" r="3.5" fill="#e5e2e1" />
      <circle cx="68" cy="40" r="3.5" fill="#e5e2e1" />
      <path d="M54 53C56 56 64 56 66 53" stroke="#e5e2e1" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M30 96C30 78 43 64 60 64C77 64 90 78 90 96"
        stroke="url(#guideGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChildAvatar({ className, alt }: { className?: string; alt: string }) {
  return (
    <svg
      role="img"
      aria-label={alt}
      className={cn("h-full w-full", className)}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="40"
        height="40"
        rx="20"
        fill="#2a2a2a"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <circle cx="20" cy="16" r="8" fill="#57f1db" fillOpacity="0.25" />
      <circle cx="17" cy="15" r="1.5" fill="#e5e2e1" />
      <circle cx="23" cy="15" r="1.5" fill="#e5e2e1" />
      <path d="M18 20C19 21 21 21 22 20" stroke="#e5e2e1" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 32C12 26 16 22 20 22C24 22 28 26 28 32"
        stroke="#57f1db"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ParentAvatar({ className, alt }: { className?: string; alt: string }) {
  return (
    <svg
      role="img"
      aria-label={alt}
      className={cn("h-full w-full", className)}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="40"
        height="40"
        rx="20"
        fill="#2a2a2a"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <circle cx="20" cy="15" r="7" fill="#adc6ff" fillOpacity="0.25" />
      <circle cx="17.5" cy="14" r="1.2" fill="#e5e2e1" />
      <circle cx="22.5" cy="14" r="1.2" fill="#e5e2e1" />
      <path d="M18 19C19 20 21 20 22 19" stroke="#e5e2e1" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M12 32C12 27 15 23 20 23C25 23 28 27 28 32"
        stroke="#adc6ff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

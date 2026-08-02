import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GuideAvatar({ className, alt }: { className?: string; alt: string }) {
  return (
    <img
      src="/parent-guide.svg"
      alt={alt}
      className={cn("h-full w-full object-cover object-top", className)}
      loading="lazy"
      decoding="async"
    />
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

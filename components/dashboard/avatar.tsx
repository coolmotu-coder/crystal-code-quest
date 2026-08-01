import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
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
      <rect width="120" height="120" rx="8" fill="#2a2a2a" />
      <circle cx="60" cy="44" r="22" fill="#3c4a46" />
      <path
        d="M38 44C38 31.85 47.85 22 60 22C72.15 22 82 31.85 82 44C82 56.15 72.15 66 60 66C47.85 66 38 56.15 38 44Z"
        fill="#57f1db"
        fillOpacity="0.2"
      />
      <circle cx="52" cy="40" r="3" fill="#e5e2e1" />
      <circle cx="68" cy="40" r="3" fill="#e5e2e1" />
      <path d="M54 52C56 54 64 54 66 52" stroke="#e5e2e1" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M30 96C30 78 43 64 60 64C77 64 90 78 90 96"
        stroke="#57f1db"
        strokeWidth="2"
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
      <rect width="40" height="40" rx="20" fill="#2a2a2a" />
      <circle cx="20" cy="16" r="8" fill="#57f1db" fillOpacity="0.3" />
      <circle cx="17" cy="15" r="1.5" fill="#e5e2e1" />
      <circle cx="23" cy="15" r="1.5" fill="#e5e2e1" />
      <path d="M18 20C19 21 21 21 22 20" stroke="#e5e2e1" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 32C12 26 16 22 20 22C24 22 28 26 28 32" stroke="#57f1db" strokeWidth="1.5" />
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
      <rect width="40" height="40" rx="20" fill="#2a2a2a" />
      <circle cx="20" cy="15" r="7" fill="#adc6ff" fillOpacity="0.3" />
      <circle cx="17.5" cy="14" r="1.2" fill="#e5e2e1" />
      <circle cx="22.5" cy="14" r="1.2" fill="#e5e2e1" />
      <path d="M18 19C19 20 21 20 22 19" stroke="#e5e2e1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 32C12 27 15 23 20 23C25 23 28 27 28 32" stroke="#adc6ff" strokeWidth="1.5" />
    </svg>
  );
}

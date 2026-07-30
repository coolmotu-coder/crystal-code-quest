type AttemptRecord = {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
};

const attempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkThrottle(identifier: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record) {
    return { allowed: true, retryAfter: 0 };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  if (record.firstAttempt + WINDOW_MS < now) {
    attempts.delete(identifier);
    return { allowed: true, retryAfter: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const lockedUntil = now + LOCKOUT_DURATION_MS;
    record.lockedUntil = lockedUntil;
    return { allowed: false, retryAfter: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  return { allowed: true, retryAfter: 0 };
}

export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record || record.firstAttempt + WINDOW_MS < now) {
    attempts.set(identifier, { count: 1, firstAttempt: now, lockedUntil: null });
    return;
  }

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
}

export function recordSuccessfulAttempt(identifier: string): void {
  attempts.delete(identifier);
}

export function clearThrottle(identifier: string): void {
  attempts.delete(identifier);
}

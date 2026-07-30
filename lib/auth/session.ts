import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { Session, sessionSchema } from "@/lib/contracts";

// Derive the cookie-store types from the installed Next.js version instead of
// inventing a ResponseCookie interface that can drift out of sync.
type NextCookieStore = Awaited<ReturnType<typeof cookies>>;
type NextSetParams = Parameters<NextCookieStore["set"]>;
type NextResponseCookie = Exclude<NextSetParams[0], string>;

// Minimal adapter that satisfies iron-session's CookieStore contract while
// forwarding to the real Next.js cookie store. All parameter types are taken
// from the actual Next.js methods.
type CookieStoreAdapter = {
  get: (name: string) => NextResponseCookie | undefined;
  set: {
    (name: string, value: string, cookie?: Partial<NextResponseCookie>): void;
    (options: NextResponseCookie): void;
  };
};

export const SESSION_COOKIE_NAME = "crystal-code-quest-session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set and at least 32 characters long. Run pnpm db:setup.",
    );
  }
  return secret;
}

function createSessionOptions(): SessionOptions {
  return {
    cookieName: SESSION_COOKIE_NAME,
    password: getSessionSecret(),
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}

export async function getSession(): Promise<IronSession<Session>> {
  const cookieStore = await cookies();
  const cookieStoreForIronSession: CookieStoreAdapter = {
    get: (name) => cookieStore.get(name),
    set: ((...args: NextSetParams) => {
      cookieStore.set(...args);
    }) as CookieStoreAdapter["set"],
  };
  return getIronSession<Session>(cookieStoreForIronSession, createSessionOptions());
}

export async function saveSession(session: IronSession<Session>): Promise<void> {
  await session.save();
}

export async function destroySession(session: IronSession<Session>): Promise<void> {
  session.destroy();
}

export function validateSession(session: IronSession<Session>): Session | null {
  if (!session.userId || !session.role) return null;
  const result = sessionSchema.safeParse({
    userId: session.userId,
    role: session.role,
    displayName: session.displayName,
  });
  return result.success ? result.data : null;
}

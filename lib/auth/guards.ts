import { redirect } from "next/navigation";
import { getSession, validateSession } from "./session";
import {
  getChildProfileByUserId,
  getCurrentChildForParent,
  getUserById,
} from "@/lib/db/queries";

export type GuardContext = {
  userId: string;
  role: "parent" | "child";
  displayName: string;
};

export async function getAuthContext(): Promise<GuardContext | null> {
  const session = await getSession();
  const valid = validateSession(session);
  if (!valid) return null;

  return {
    userId: valid.userId,
    role: valid.role,
    displayName: valid.displayName,
  };
}

export async function requireAuth(): Promise<GuardContext> {
  const ctx = await getAuthContext();
  if (!ctx) {
    redirect("/login");
  }
  return ctx;
}

export async function requireParent(): Promise<{
  userId: string;
  displayName: string;
}> {
  const ctx = await requireAuth();
  if (ctx.role !== "parent") {
    redirect("/access-denied");
  }

  const user = getUserById(ctx.userId);
  if (!user || user.role !== "parent") {
    redirect("/access-denied");
  }

  return { userId: ctx.userId, displayName: ctx.displayName };
}

export async function requireChild(): Promise<{
  userId: string;
  profileId: string;
  displayName: string;
}> {
  const ctx = await requireAuth();
  if (ctx.role !== "child") {
    redirect("/access-denied");
  }

  const user = getUserById(ctx.userId);
  if (!user || user.role !== "child") {
    redirect("/access-denied");
  }

  const profile = getChildProfileByUserId(ctx.userId);
  if (!profile) {
    redirect("/access-denied");
  }

  return {
    userId: ctx.userId,
    profileId: profile.id,
    displayName: ctx.displayName,
  };
}

export async function requireParentWithChild(): Promise<{
  userId: string;
  displayName: string;
  childProfileId: string;
}> {
  const parent = await requireParent();
  const childProfile = getCurrentChildForParent(parent.userId);
  if (!childProfile) {
    redirect("/access-denied");
  }

  return {
    userId: parent.userId,
    displayName: parent.displayName,
    childProfileId: childProfile.id,
  };
}

export function requireParentApi(sessionContext: GuardContext): {
  userId: string;
  displayName: string;
  childProfileId: string;
} {
  if (sessionContext.role !== "parent") {
    throw new Error("Forbidden");
  }

  const user = getUserById(sessionContext.userId);
  if (!user || user.role !== "parent") {
    throw new Error("Forbidden");
  }

  const childProfile = getCurrentChildForParent(sessionContext.userId);
  if (!childProfile) {
    throw new Error("Forbidden");
  }

  return {
    userId: sessionContext.userId,
    displayName: sessionContext.displayName,
    childProfileId: childProfile.id,
  };
}

export function requireChildApi(sessionContext: GuardContext): {
  userId: string;
  profileId: string;
  displayName: string;
} {
  if (sessionContext.role !== "child") {
    throw new Error("Forbidden");
  }

  const user = getUserById(sessionContext.userId);
  if (!user || user.role !== "child") {
    throw new Error("Forbidden");
  }

  const profile = getChildProfileByUserId(sessionContext.userId);
  if (!profile) {
    throw new Error("Forbidden");
  }

  return {
    userId: sessionContext.userId,
    profileId: profile.id,
    displayName: sessionContext.displayName,
  };
}

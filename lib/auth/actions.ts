"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  childLoginSchema,
  createChildSchema,
  parentLoginSchema,
  parentSetupSchema,
  Role,
} from "@/lib/contracts";
import { destroySession, getSession, saveSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { checkThrottle, recordFailedAttempt, recordSuccessfulAttempt } from "@/lib/auth/throttle";
import { requireParent } from "@/lib/auth/guards";
import {
  createChildProfile,
  createFirstParent,
  createParentChildRelationship,
  createUser,
  getChildProfileByUserId,
  getUserByEmail,
  getUserByUsername,
} from "@/lib/db/queries";

export type LoginResult = { success: true; role: Role } | { success: false; error: string };

export async function loginParent(formData: FormData): Promise<LoginResult> {
  const raw = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const parsed = parentLoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Please enter a valid email and password." };
  }

  const throttle = checkThrottle(parsed.data.email);
  if (!throttle.allowed) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const user = getUserByEmail(parsed.data.email);
  if (!user || user.role !== "parent") {
    recordFailedAttempt(parsed.data.email);
    return { success: false, error: "Invalid email or password." };
  }

  const valid = await verifyPassword(parsed.data.password, user.password_hash);
  if (!valid) {
    recordFailedAttempt(parsed.data.email);
    return { success: false, error: "Invalid email or password." };
  }

  recordSuccessfulAttempt(parsed.data.email);

  const session = await getSession();
  session.userId = user.id;
  session.role = "parent";
  session.displayName = user.name;
  await saveSession(session);

  revalidatePath("/parent");
  return { success: true, role: "parent" };
}

export async function loginChild(formData: FormData): Promise<LoginResult> {
  const raw = {
    username: formData.get("username")?.toString() ?? "",
    pin: formData.get("pin")?.toString() ?? "",
  };

  const parsed = childLoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Please enter a valid username and PIN." };
  }

  const throttle = checkThrottle(parsed.data.username);
  if (!throttle.allowed) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const user = getUserByUsername(parsed.data.username);
  if (!user || user.role !== "child") {
    recordFailedAttempt(parsed.data.username);
    return { success: false, error: "Invalid username or PIN." };
  }

  const valid = await verifyPassword(parsed.data.pin, user.password_hash);
  if (!valid) {
    recordFailedAttempt(parsed.data.username);
    return { success: false, error: "Invalid username or PIN." };
  }

  recordSuccessfulAttempt(parsed.data.username);

  const profile = getChildProfileByUserId(user.id);
  const session = await getSession();
  session.userId = user.id;
  session.role = "child";
  session.displayName = profile?.display_name ?? user.name;
  await saveSession(session);

  revalidatePath("/child");
  return { success: true, role: "child" };
}

export async function logout(): Promise<void> {
  const session = await getSession();
  await destroySession(session);
  redirect("/login");
}

export async function setupParent(formData: FormData): Promise<LoginResult> {
  const raw = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const parsed = parentSetupSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please enter a valid email and a password of at least 8 characters.",
    };
  }

  const throttle = checkThrottle(parsed.data.email);
  if (!throttle.allowed) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(parsed.data.password);

  const result = createFirstParent({
    id: userId,
    email: parsed.data.email,
    role: "parent",
    password_hash: passwordHash,
    name: "Parent",
    created_at: now,
    updated_at: now,
  });

  if (!result.created) {
    notFound();
  }

  recordSuccessfulAttempt(parsed.data.email);

  const session = await getSession();
  session.userId = userId;
  session.role = "parent";
  session.displayName = "Parent";
  await saveSession(session);

  revalidatePath("/parent");
  return { success: true, role: "parent" };
}

export type CreateChildResult =
  { success: true; username: string } | { success: false; error: string };

export async function createChild(formData: FormData): Promise<CreateChildResult> {
  const parent = await requireParent();

  const raw = {
    displayName: formData.get("displayName")?.toString() ?? "",
    username: formData.get("username")?.toString() ?? "",
    pin: formData.get("pin")?.toString() ?? "",
  };

  const parsed = createChildSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please enter a display name, username, and a PIN of at least 6 digits.",
    };
  }

  const existingUser = getUserByUsername(parsed.data.username);
  if (existingUser) {
    return { success: false, error: "That username is already taken." };
  }

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const relationshipId = crypto.randomUUID();
  const pinHash = await hashPassword(parsed.data.pin);

  createUser({
    id: userId,
    email: null,
    role: "child",
    password_hash: pinHash,
    name: parsed.data.username,
    created_at: now,
    updated_at: now,
  });

  createChildProfile({
    id: profileId,
    user_id: userId,
    display_name: parsed.data.displayName,
    level: 1,
    xp: 0,
    streak_days: 0,
    current_stage_id: null,
    created_at: now,
    updated_at: now,
  });

  createParentChildRelationship({
    id: relationshipId,
    parent_user_id: parent.userId,
    child_user_id: userId,
    created_at: now,
  });

  revalidatePath("/parent");
  return { success: true, username: parsed.data.username };
}

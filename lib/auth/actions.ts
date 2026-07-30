"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  childLoginSchema,
  parentLoginSchema,
  Role,
} from "@/lib/contracts";
import { destroySession, getSession, saveSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import {
  checkThrottle,
  recordFailedAttempt,
  recordSuccessfulAttempt,
} from "@/lib/auth/throttle";
import {
  getChildProfileByUserId,
  getUserByEmail,
  getUserByUsername,
} from "@/lib/db/queries";

export type LoginResult =
  | { success: true; role: Role }
  | { success: false; error: string };

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

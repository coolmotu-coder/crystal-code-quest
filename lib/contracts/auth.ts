import { z } from "zod";

export const Role = z.enum(["parent", "child"]);
export type Role = z.infer<typeof Role>;

export const parentLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const childLoginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  pin: z.string().regex(/^\d{6,}$/, "PIN must be at least 6 digits."),
});

export const sessionSchema = z.object({
  userId: z.string().uuid(),
  role: Role,
  displayName: z.string(),
});

export const parentSetupSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const createChildSchema = z.object({
  displayName: z.string().min(1, "Display name is required.").max(50, "Display name is too long."),
  username: z.string().min(1, "Username is required.").max(50, "Username is too long."),
  pin: z.string().regex(/^\d{6,}$/, "PIN must be at least 6 digits."),
});

export type ParentLoginInput = z.infer<typeof parentLoginSchema>;
export type ChildLoginInput = z.infer<typeof childLoginSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type ParentSetupInput = z.infer<typeof parentSetupSchema>;
export type CreateChildInput = z.infer<typeof createChildSchema>;

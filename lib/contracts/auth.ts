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

export type ParentLoginInput = z.infer<typeof parentLoginSchema>;
export type ChildLoginInput = z.infer<typeof childLoginSchema>;
export type Session = z.infer<typeof sessionSchema>;

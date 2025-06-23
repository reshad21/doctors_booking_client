// schemas/loginSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email or username is required" })
    .email({ message: "Invalid email address" }), // remove `.email()` if username is allowed
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

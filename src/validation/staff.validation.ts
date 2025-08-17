import * as z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .number()
    .min(11, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  staffImage: z.any().optional(),
});

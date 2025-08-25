import z from "zod";

export const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  appDate: z.string().nonempty("Appointment Date is required"),
  phoneNumber: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(/^0\d{10}$/, "Phone number must start with 0 and be 11 digits long"),
  email: z.string().optional(),
  age: z.union([z.number(), z.string()]).refine((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return !isNaN(num) && num > 0;
  }, "Age must be a valid positive number"),
  weight: z
    .union([z.number(), z.string(), z.undefined()])
    .optional()
    .refine((val) => {
      if (val === undefined || val === "" || val === null) return true;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return !isNaN(num) && num > 0;
    }, "Weight must be a valid positive number"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  chamberId: z.string().min(1, "Chamber is required"),
  status: z.enum(["NEW", "OLD", "REPORT"]),
});

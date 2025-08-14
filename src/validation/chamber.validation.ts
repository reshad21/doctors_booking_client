import z from "zod";

export const chamberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  oldPatientFee: z.number().min(1, "Old Patient Fee is required"),
  newPatientFee: z.number().min(1, "New Patient Fee is required"),
  reportFee: z.number().min(1, "Report Fee is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  day: z.string().min(1, "Day is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

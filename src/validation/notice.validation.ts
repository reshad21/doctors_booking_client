import z from "zod";

export const displayNoticeSchema = z.object({
  description: z.string().min(1, "Description is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

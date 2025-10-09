import z from "zod";

const medicineValidation = z.object({
  nameManufacturer: z.string().min(1, "Manufacturer name is required"),
  brandName: z.string().min(1, "Brand name is required"),
  genericName: z.string().min(1, "Generic name is required"),
  strength: z.string().min(1, "Strength is required"),
  dosageDescription: z.string().min(1, "Dosage description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  useFor: z.string().min(1, "Use for is required"),
});

export default medicineValidation;

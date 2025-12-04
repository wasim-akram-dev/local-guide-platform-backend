import z from "zod";

export const createBookingSchema = z.object({
  listingId: z.string().uuid("Invalid listing id"),
  date: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  numberOfPeople: z.number().min(1, "At least one person required"),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"]),
});

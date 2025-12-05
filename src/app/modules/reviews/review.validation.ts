import z from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string(),
  guideId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

import { z } from "zod";

export const createPaymentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().min(1),
  transactionId: z.string(), // from SSLCommerz/Stripe webhook later
});

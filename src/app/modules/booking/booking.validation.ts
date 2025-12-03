import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    tourId: z.string(),
    date: z.string().datetime(), // ISO format date
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED", "CANCELED"]),
  }),
});

export enum BookingStatus {
  PENDING,
  APPROVED,
  REJECTED,
  CANCELED,
}

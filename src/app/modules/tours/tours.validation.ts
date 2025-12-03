import { z } from "zod";

export const createTourSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().min(10, "Description too short"),
    price: z.number().positive("Price must be positive"),
    location: z.string().min(3, "Location required"),
    images: z.array(z.string()).default([]),
  }),
});

export const updateTourSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    location: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
});

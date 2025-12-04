import z from "zod";

// Predefined category list
const CATEGORIES = [
  "Adventure",
  "City Tour",
  "Culture",
  "Historical",
  "Nature",
  "Others",
] as const;

export const createListingSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(2, "Title must be at least 2 characters"),

  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(10, "Description must be minimum 10 characters"),

  itinerary: z
    .string({ error: "Itinerary is required" })
    .trim()
    .min(5, "Itinerary must be minimum 5 characters"),

  tourFee: z
    .number({ error: "Tour fee must be a number" })
    .positive("Tour fee must be greater than 0"),

  duration: z
    .number({ error: "Duration must be a number" })
    .min(1, "Duration must be at least 1 day/hour"),

  meetingPoint: z
    .string({ error: "Meeting point is required" })
    .trim()
    .min(3, "Meeting point must be at least 3 characters"),

  maxGroupSize: z
    .number({ error: "Max group size must be a number" })
    .min(1, "Group size must be at least 1"),

  images: z.array(z.string().url("Image must be a valid URL")).default([]),

  city: z
    .string({ error: "City name is required" })
    .trim()
    .min(2, "City name must be at least 2 characters"),

  category: z
    .string({ error: "Category is required" })
    .refine((val) => CATEGORIES.includes(val as any), {
      message: `Category must be one of: ${CATEGORIES.join(", ")}`,
    }),
});

// For UPDATE → all fields optional but validate types properly
export const updateListingSchema = createListingSchema.partial();

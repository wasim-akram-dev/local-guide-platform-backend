import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profilePic: z.string().optional(),
  role: z.enum(["TOURIST", "GUIDE"]).default("TOURIST"),

  // Optional common profile fields
  bio: z.string().optional(),
  languages: z.array(z.string()).optional(),

  // Optional guide fields
  expertise: z.array(z.string()).optional(),
  dailyRate: z.number().optional(),

  // Optional tourist fields
  preferences: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

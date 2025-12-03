import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TOURIST", "GUIDE", "ADMIN"]).default("TOURIST"),
  profilePic: z.string().optional(),
  bio: z.string().optional(),
  languages: z.array(z.string()).default([]),
  expertise: z.array(z.string()).optional(),
  dailyRate: z.number().optional(),
  preferences: z.array(z.string()).optional(),
});

export const updateUserSchema = createUserSchema.partial();

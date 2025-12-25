import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  profilePic: z.string().optional(),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional(),

  // Guide-only fields (safe to keep optional)
  expertise: z.array(z.string()).optional(),
  dailyRate: z.number().optional(),

  // Tourist-only fields
  preferences: z.array(z.string()).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z
    .enum(["TOURIST", "GUIDE", "ADMIN"])
    .refine((val) => !!val, { message: "Role is required" }),
});

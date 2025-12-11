import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateUserRoleSchema = z.object({
  role: z
    .enum(["TOURIST", "GUIDE", "ADMIN"])
    .refine((val) => !!val, { message: "Role is required" }),
});

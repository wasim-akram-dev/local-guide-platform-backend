import z from "zod";
import { loginSchema, registerSchema } from "../modules/auth/auth.validation";

export type RegisterPayload = z.infer<typeof registerSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;

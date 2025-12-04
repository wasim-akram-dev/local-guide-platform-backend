import { NextFunction, Response } from "express";
import ApiError from "../errors/ApiError";

// roles: string or array of strings
export const roleGuard = (roles: string | string[]) => {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new ApiError(401, "Not authenticated"));

    if (!allowed.includes(user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient permissions"));
    }

    next();
  };
};

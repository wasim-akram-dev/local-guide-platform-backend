import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import ApiError from "../errors/ApiError";
import { jwtHelper } from "../helper/jwtHelper";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "TOURIST" | "GUIDE" | "ADMIN";
  };
}

const authGuard = (...roles: ("TOURIST" | "GUIDE" | "ADMIN")[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // 1️⃣ Get token from cookies or Authorization header
      const token =
        req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "No token provided");
      }

      // 2️⃣ Validate token
      const decoded = jwtHelper.verifyToken(token, config.jwt.access_secret);

      if (!decoded) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
      }

      // 3️⃣ Attach user to request
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      // 4️⃣ Check role-based access
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Access denied");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default authGuard;

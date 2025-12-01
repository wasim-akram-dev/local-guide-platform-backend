import { Request, Response } from "express";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import { jwtHelper } from "../../helper/jwtHelper";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validation";

const register = catchAsync(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, parsed.error.message);
  }

  const user = await AuthServices.register(parsed.data);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.message);
  }

  const { user, accessToken, refreshToken } = await AuthServices.login(
    parsed.data
  );

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  // res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully",
    data: { user },
  });
});

const me = catchAsync(async (req: any, res: Response) => {
  const accessToken = req.cookies.accessToken || req.headers.authorization;

  console.log("from me > auth controller:", accessToken);

  const decodedData = jwtHelper.verifyToken(
    accessToken,
    config.jwt.access_secret
  );

  const user = decodedData;
  console.log("user from auth.controller:me", user);

  if (!user) throw new ApiError(401, "Not authenticated");

  const result = await AuthServices.me(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched",
    data: result,
  });
});

export const AuthControllers = { register, login, me };

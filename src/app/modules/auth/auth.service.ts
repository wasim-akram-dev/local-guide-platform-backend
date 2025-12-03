import bcrypt from "bcryptjs";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import { jwtHelper } from "../../helper/jwtHelper";
import prisma from "../../shared/prisma";
import { LoginPayload, RegisterPayload } from "../../types/common";

const register = async (payload: RegisterPayload) => {
  const {
    name,
    email,
    password,
    role,
    bio,
    languages,
    expertise,
    dailyRate,
    preferences,
  } = payload;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashed,
      role: role === "GUIDE" ? "GUIDE" : "TOURIST",
      bio: bio,
      languages: languages ?? [],
      expertise: expertise ?? [],
      dailyRate: dailyRate ?? null,
      preferences: preferences ?? [],
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePic: true,
      bio: true,
      languages: true,
      expertise: true,
      dailyRate: true,
      isVerified: true,
      preferences: true,
      createdAt: true,
    },
  });

  return user;
};

const login = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = jwtHelper.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.access_secret,
    config.jwt.access_expires
  );

  const refreshToken = jwtHelper.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires
  );

  // return user data without password
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    // profilePic: user.profilePic,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { user: safeUser, accessToken, refreshToken };
};

const me = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePic: true,
      bio: true,
      languages: true,
      expertise: true,
      dailyRate: true,
      isVerified: true,
      preferences: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const AuthServices = { register, login, me };

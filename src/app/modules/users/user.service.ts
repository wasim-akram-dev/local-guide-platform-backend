import { Role } from "../../../generated/enums";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

// Get single user by ID
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      listings: true,
      reviewsGiven: true,
      reviewsReceived: true,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  return user;
};

// Update user details
const updateUser = async (id: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new ApiError(404, "User not found");

  return await prisma.user.update({
    where: { id },
    data: payload,
  });
};

// Update role (ADMIN only)
const updateUserRole = async (id: string, role: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new ApiError(404, "User not found");

  if (!["TOURIST", "GUIDE", "ADMIN"].includes(role)) {
    throw new ApiError(400, "Invalid role value");
  }

  return await prisma.user.update({
    where: { id },
    data: { role: role as Role },
  });
};

// Delete user
const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found");

  return await prisma.user.delete({ where: { id } });
};

// Get All Users (with role filter + pagination)
const getAllUsers = async (role?: string, page = 1, limit = 20) => {
  const filter: any = {};
  if (role) filter.role = role;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: filter }),
  ]);

  return { users, total, page, limit };
};

export const UsersServices = {
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
  getAllUsers,
};

import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UsersServices } from "./user.service";

// Get all users with filters + pagination
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, page, limit } = req.query;

  const result = await UsersServices.getAllUsers(
    role as string,
    Number(page) || 1,
    Number(limit) || 20
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

// Get single user
const getUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const requester = (req as any).user;

  // User can only access themselves unless admin
  if (requester.role !== "ADMIN" && requester.id !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  const result = await UsersServices.getUserById(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single user fetched",
    data: result,
  });
});

// Update user (admin or user themselves)
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const requester = (req as any).user;
  const userId = req.params.id;

  if (requester.role !== "ADMIN" && requester.id !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  const result = await UsersServices.updateUser(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

// Update User Role (admin only)
const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersServices.updateUserRole(
    req.params.id,
    req.body.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role updated successfully",
    data: result,
  });
});

// Delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersServices.deleteUser(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UsersControllers = {
  getAllUsers,
  getUser,
  updateUser,
  updateUserRole,
  deleteUser,
};

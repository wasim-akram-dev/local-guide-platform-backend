import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UsersServices } from "./users.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersServices.createUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersServices.getUserById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single user fetched",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersServices.updateUser(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersServices.getAllUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

export const UsersControllers = {
  createUser,
  getUser,
  updateUser,
  getAllUsers,
};

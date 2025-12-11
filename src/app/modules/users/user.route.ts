import express from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { UsersControllers } from "./user.controller";
import { updateUserRoleSchema, updateUserSchema } from "./user.validation";

const router = express.Router();

// Get all users (with filters + pagination)
// Only admin
router.get("/", authGuard("ADMIN"), UsersControllers.getAllUsers);

// Get single user (admin + user themselves)
router.get(
  "/:id",
  authGuard("ADMIN", "TOURIST", "GUIDE"),
  UsersControllers.getUser
);

// Update user profile (only admin or the user themselves)
router.patch(
  "/:id",
  authGuard("ADMIN", "TOURIST", "GUIDE"),
  validateRequest(updateUserSchema),
  UsersControllers.updateUser
);

//  Update role (only admin)
router.patch(
  "/:id/role",
  authGuard("ADMIN"),
  validateRequest(updateUserRoleSchema),
  UsersControllers.updateUserRole
);

// Delete user (only admin)
router.delete("/:id", authGuard("ADMIN"), UsersControllers.deleteUser);

export const UsersRoutes = router;

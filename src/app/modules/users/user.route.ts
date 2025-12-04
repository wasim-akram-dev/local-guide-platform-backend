import express from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { UsersControllers } from "./user.controller";
import { updateUserSchema } from "./user.validation";

const router = express.Router();

router.get("/:id", UsersControllers.getUser);
router.get("/", authGuard("ADMIN"), UsersControllers.getAllUsers);
router.patch(
  "/:id",
  validateRequest(updateUserSchema),
  UsersControllers.updateUser
);

export const UsersRoutes = router;

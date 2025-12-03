import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UsersControllers } from "./users.controller";
import { createUserSchema, updateUserSchema } from "./users.validation";

const router = express.Router();

router.get("/:id", UsersControllers.getUser);
router.get("/", UsersControllers.getAllUsers);
router.post(
  "/",
  validateRequest(createUserSchema),
  UsersControllers.createUser
);
router.patch(
  "/:id",
  validateRequest(updateUserSchema),
  UsersControllers.updateUser
);

export const UsersRoutes = router;

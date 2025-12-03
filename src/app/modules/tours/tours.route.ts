import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { TourController } from "./tours.controller";
import { createTourSchema, updateTourSchema } from "./tours.validation";

const router = Router();

// Must be GUIDE
router.post(
  "/create",
  authGuard("GUIDE"),
  validateRequest(createTourSchema),
  TourController.createTour
);

// Public
router.get("/", TourController.getAllTours);
router.get("/:id", TourController.getSingleTour);

// Only guide who created the tour can update/delete
router.patch(
  "/:id",
  authGuard("GUIDE"),
  validateRequest(updateTourSchema),
  TourController.updateTour
);

router.delete("/:id", authGuard("GUIDE"), TourController.deleteTour);

export const ToursRoutes = router;

// router.post("/create", authGuard("GUIDE"), createTour);
// router.get("/users", authGuard("ADMIN"), getAllUsers);
// router.get("/profile", authGuard(), getProfile);
// const guideId = req.user!.id;

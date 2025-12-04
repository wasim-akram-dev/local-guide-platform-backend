import express from "express";

import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { BookingsController } from "./booking.controller";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "./booking.validation";

const router = express.Router();

// Create booking — Tourist only
router.post(
  "/",
  authGuard("TOURIST"),
  validateRequest(createBookingSchema),
  BookingsController.createBooking
);

// Get a booking (tourist/guide/admin — controller enforces security)
// router.get("/:id",authGuard("TOURIST", "GUIDE", "ADMIN"), BookingsController.getBooking);
router.get("/:id", BookingsController.getBooking);

// Get my bookings (role-aware)
// All users can see their bookings (admin sees all)
router.get(
  "/",
  authGuard("TOURIST", "GUIDE", "ADMIN"),
  BookingsController.getMyBookings
);

// Guide approves or rejects
// Update booking status
// - Guides accept/reject -> roleGuard("GUIDE")
// - Tourists cancel -> roleGuard("TOURIST")
// - Admin can update -> roleGuard("ADMIN") or full access in controller
// router.patch(
//   "/:id/status",
//   authGuard("TOURIST", "GUIDE", "ADMIN"),
//   validateRequest(updateBookingStatusSchema),
//   BookingsController.updateStatus
// );
router.patch(
  "/:id/status",
  validateRequest(updateBookingStatusSchema),
  BookingsController.updateStatus
);

// Tourist cancels booking
// router.patch(
//   "/cancel/:id",
//   authGuard("TOURIST"),
//   BookingsController.cancelBooking
// );

export const BookingsRoutes = router;

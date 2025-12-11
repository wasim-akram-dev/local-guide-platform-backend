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
router.get(
  "/:id",
  authGuard("TOURIST", "GUIDE", "ADMIN"),
  BookingsController.getBooking
);

// GET all bookings with filters / pagination
router.get(
  "/",
  authGuard("TOURIST", "GUIDE", "ADMIN"),
  BookingsController.getAllBookings
);

// Guide approves or rejects
// Update booking status
// - Guides accept/reject -> roleGuard("GUIDE")
// - Tourists cancel -> roleGuard("TOURIST")
// - Admin can update -> roleGuard("ADMIN") or full access in controller
router.patch(
  "/:id/status",
  authGuard("TOURIST", "GUIDE", "ADMIN"),
  validateRequest(updateBookingStatusSchema),
  BookingsController.updateStatus
);

// Cancel booking (soft delete)
router.patch(
  "/:id/cancel",
  authGuard("TOURIST", "ADMIN"),
  BookingsController.cancelBooking
);

export const BookingsRoutes = router;

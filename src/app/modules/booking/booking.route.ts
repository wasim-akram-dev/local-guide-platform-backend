import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { BookingController } from "./booking.controller";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "./booking.validation";

const router = Router();

// Tourist creates booking
router.post(
  "/",
  authGuard("TOURIST"),
  validateRequest(createBookingSchema),
  BookingController.createBooking
);

// All users can see their bookings (admin sees all)
router.get(
  "/",
  authGuard("TOURIST", "GUIDE", "ADMIN"),
  BookingController.getBookings
);

// Guide approves or rejects
router.patch(
  "/status/:id",
  authGuard("GUIDE"),
  validateRequest(updateBookingStatusSchema),
  BookingController.updateStatus
);

// Tourist cancels booking
router.patch(
  "/cancel/:id",
  authGuard("TOURIST"),
  BookingController.cancelBooking
);

export const BookingsRoutes = router;

// 🚀 API Flow
// Tourist Booking
// POST /api/bookings
// {
//   "tourId": "xxxx",
//   "date": "2025-05-30T10:00:00.000Z"
// }

// Guide approve/reject
// PATCH /api/bookings/status/:id
// {
//   "status": "APPROVED"
// }

// Tourist cancel
// PATCH /api/bookings/cancel/:id

// Get all user bookings
// GET /api/bookings

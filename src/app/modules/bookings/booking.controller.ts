import { Response } from "express";
import { BookingStatus } from "../../../generated/enums";
import ApiError from "../../errors/ApiError";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { BookingsService } from "./booking.service";

const createBooking = catchAsync(async (req: any, res: Response) => {
  const touristId = req.user.id;
  const payload = req.body;
  const result = await BookingsService.createBooking(touristId, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created (pending guide acceptance)",
    data: result,
  });
});

const getBooking = catchAsync(async (req: any, res: Response) => {
  const booking = await BookingsService.getBookingById(req.params.id);

  // Only involved users or admin can view
  const user = req.user;
  if (
    user.role !== "ADMIN" &&
    booking.touristId !== user.id &&
    booking.guideId !== user.id
  ) {
    throw new ApiError(403, "Forbidden");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking fetched",
    data: booking,
  });
});

const getMyBookings = catchAsync(async (req: any, res: Response) => {
  const user = req.user;
  let data;
  if (user.role === "TOURIST") {
    data = await BookingsService.getBookingsForTourist(user.id);
  } else if (user.role === "GUIDE") {
    data = await BookingsService.getBookingsForGuide(user.id);
  } else if (user.role === "ADMIN") {
    data = await BookingsService.getAllBookings();
  } else {
    throw new ApiError(403, "Forbidden");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings fetched",
    data,
  });
});

const updateStatus = catchAsync(async (req: any, res: Response) => {
  const bookingId = req.params.id;
  const newStatus = req.body.status as BookingStatus;
  const user = req.user;

  const result = await BookingsService.updateBookingStatus(
    bookingId,
    user.id,
    newStatus,
    user.role
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking status updated",
    data: result,
  });
});

export const BookingsController = {
  createBooking,
  getBooking,
  getMyBookings,
  updateStatus,
};

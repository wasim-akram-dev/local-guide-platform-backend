import { Request, Response } from "express";
import { BookingService } from "./booking.service";

const createBooking = async (req: Request & { user?: any }, res: Response) => {
  const result = await BookingService.createBooking(req.body, req.user.id);
  res
    .status(201)
    .json({ success: true, message: "Booking created", data: result });
};

const getBookings = async (req: Request & { user?: any }, res: Response) => {
  const data = await BookingService.getBookingsForUser(req.user);
  res.json({ success: true, data });
};

const updateStatus = async (req: Request & { user?: any }, res: Response) => {
  const updated = await BookingService.updateBookingStatus(
    req.params.id,
    req.body.status,
    req.user.id
  );

  if (!updated.count)
    return res.status(403).json({ success: false, message: "Not allowed" });

  res.json({ success: true, message: "Status updated" });
};

const cancelBooking = async (req: Request & { user?: any }, res: Response) => {
  const canceled = await BookingService.cancelBooking(
    req.params.id,
    req.user.id
  );

  if (!canceled.count)
    return res.status(403).json({ success: false, message: "Not allowed" });

  res.json({ success: true, message: "Booking canceled" });
};

export const BookingController = {
  createBooking,
  getBookings,
  updateStatus,
  cancelBooking,
};

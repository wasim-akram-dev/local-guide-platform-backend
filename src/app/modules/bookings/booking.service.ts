import { BookingStatus } from "../../../generated/enums";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

/**
 * totalPrice = listing.tourFee * numberOfPeople
 * Assumes listing.tourFee is price per person.
 */

type CreatePayload = {
  listingId: string;
  date: string; // ISO string
  numberOfPeople: number;
};

const createBooking = async (touristId: string, payload: CreatePayload) => {
  // Ensure listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: payload.listingId },
  });
  if (!listing) throw new ApiError(404, "Listing not found");

  // Prevent booking in the past
  const dateObj = new Date(payload.date);
  if (isNaN(dateObj.getTime())) throw new ApiError(400, "Invalid date");
  if (dateObj < new Date()) throw new ApiError(400, "Cannot book a past date");

  // calculate total price
  const totalPrice = listing.tourFee * payload.numberOfPeople;

  const booking = await prisma.booking.create({
    data: {
      listingId: listing.id,
      touristId,
      guideId: listing.guideId,
      date: dateObj,
      numberOfPeople: payload.numberOfPeople,
      totalPrice,
      status: "PENDING",
    },
  });

  return booking;
};

const getBookingById = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { listing: true, tourist: true, guide: true },
  });
  if (!booking) throw new ApiError(404, "Booking not found");
  return booking;
};

const getBookingsForTourist = async (touristId: string) => {
  return await prisma.booking.findMany({
    where: { touristId },
    include: { listing: true, guide: true },
    orderBy: { date: "desc" },
  });
};

const getBookingsForGuide = async (guideId: string) => {
  return await prisma.booking.findMany({
    where: { guideId },
    include: { listing: true, tourist: true },
    orderBy: { date: "desc" },
  });
};

const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: { listing: true, tourist: true, guide: true },
    orderBy: { createdAt: "desc" },
  });
};

const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  newStatus: BookingStatus,
  userRole: string
) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new ApiError(404, "Booking not found");

  // Only guide for that listing or admin can accept/reject/complete;
  // tourist can cancel their own bookings.
  if (userRole === "GUIDE") {
    if (booking.guideId !== userId) throw new ApiError(403, "Forbidden");
    // allowed transitions for guides: PENDING -> ACCEPTED/REJECTED, ACCEPTED -> COMPLETED
    // (you can refine transitions as needed)
  } else if (userRole === "TOURIST") {
    if (booking.touristId !== userId) throw new ApiError(403, "Forbidden");
    // tourists can only cancel their own booking
    if (newStatus !== "CANCELLED")
      throw new ApiError(403, "Tourists can only cancel bookings");
  } else if (userRole === "ADMIN") {
    // admin allowed
  } else {
    throw new ApiError(403, "Forbidden");
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  });

  return updated;
};

export const BookingsService = {
  createBooking,
  getBookingById,
  getBookingsForTourist,
  getBookingsForGuide,
  getAllBookings,
  updateBookingStatus,
};

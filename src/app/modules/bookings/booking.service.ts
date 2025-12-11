import { BookingStatus } from "../../../generated/enums";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type CreatePayload = {
  listingId: string;
  date: string;
  numberOfPeople: number;
};

const createBooking = async (touristId: string, payload: CreatePayload) => {
  const listing = await prisma.listing.findUnique({
    where: { id: payload.listingId },
  });
  if (!listing) throw new ApiError(404, "Listing not found");

  const dateObj = new Date(payload.date);
  if (isNaN(dateObj.getTime())) throw new ApiError(400, "Invalid date");
  if (dateObj < new Date()) throw new ApiError(400, "Cannot book a past date");

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
      active: true, // for soft delete
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
    where: { touristId, active: true },
    include: { listing: true, guide: true },
    orderBy: { date: "desc" },
  });
};

const getBookingsForGuide = async (guideId: string) => {
  return await prisma.booking.findMany({
    where: { guideId, active: true },
    include: { listing: true, tourist: true },
    orderBy: { date: "desc" },
  });
};

// Admin enhanced version: filtering, pagination, sorting
const getAllBookings = async (query?: any) => {
  const {
    status,
    guideId,
    touristId,
    fromDate,
    toDate,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query || {};

  const filters: any = { active: true };
  if (status) filters.status = status;
  if (guideId) filters.guideId = guideId;
  if (touristId) filters.touristId = touristId;
  if (fromDate || toDate) filters.date = {};
  if (fromDate) filters.date.gte = new Date(fromDate);
  if (toDate) filters.date.lte = new Date(toDate);

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  return prisma.booking.findMany({
    where: filters,
    include: { listing: true, tourist: true, guide: true },
    orderBy: { [sortBy]: sortOrder },
    skip,
    take,
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

  if (userRole === "GUIDE") {
    if (booking.guideId !== userId) throw new ApiError(403, "Forbidden");
  } else if (userRole === "TOURIST") {
    if (booking.touristId !== userId) throw new ApiError(403, "Forbidden");
    if (newStatus !== "CANCELLED")
      throw new ApiError(403, "Tourists can only cancel bookings");
  } else if (userRole !== "ADMIN") {
    throw new ApiError(403, "Forbidden");
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  });

  return updated;
};

// Soft delete / cancel booking (Admin or Tourist)
const cancelBooking = async (
  bookingId: string,
  userId: string,
  userRole: string
) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new ApiError(404, "Booking not found");

  if (
    (userRole === "TOURIST" && booking.touristId !== userId) ||
    userRole === "GUIDE"
  ) {
    throw new ApiError(403, "Forbidden");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED", active: false },
  });
};

export const BookingsService = {
  createBooking,
  getBookingById,
  getBookingsForTourist,
  getBookingsForGuide,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
};

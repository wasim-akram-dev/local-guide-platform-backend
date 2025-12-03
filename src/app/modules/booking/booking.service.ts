import { BookingStatus } from "../../../generated/enums";
import prisma from "../../shared/prisma";

const createBooking = async (payload: any, userId: string) => {
  const tour = await prisma.tour.findUnique({ where: { id: payload.tourId } });
  if (!tour) throw new Error("Tour not found");

  return prisma.booking.create({
    data: {
      tourId: payload.tourId,
      userId,
      guideId: tour.guideId,
      date: new Date(payload.date),
    },
  });
};

const getBookingsForUser = async (user: any) => {
  if (user.role === "ADMIN") {
    return prisma.booking.findMany({
      include: { tour: true, user: true, guide: true },
    });
  }

  if (user.role === "GUIDE") {
    return prisma.booking.findMany({
      where: { guideId: user.id },
      include: { user: true, tour: true },
    });
  }

  return prisma.booking.findMany({
    where: { userId: user.id },
    include: { tour: true, guide: true },
  });
};

const updateBookingStatus = async (
  id: string,
  status: BookingStatus,
  guideId: string
) => {
  return prisma.booking.updateMany({
    where: { id, guideId },
    data: { status },
  });
};

const cancelBooking = async (id: string, userId: string) => {
  return prisma.booking.updateMany({
    where: { id, userId },
    data: { status: "CANCELED" },
  });
};

export const BookingService = {
  createBooking,
  getBookingsForUser,
  updateBookingStatus,
  cancelBooking,
};

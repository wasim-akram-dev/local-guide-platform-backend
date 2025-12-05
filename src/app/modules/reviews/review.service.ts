import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

export const reviewService = {
  createReview: async (payload: any, userId: string) => {
    const { bookingId, guideId, rating, comment } = payload;

    // 1. Check if booking exists and is completed
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        touristId: userId, // Only review own booking
        status: "COMPLETED",
      },
    });

    if (!booking) {
      throw new ApiError(400, "Review is only allowed after completed booking");
    }

    // 2. Prevent duplicate review for same booking
    const existingReview = await prisma.review.findFirst({
      where: { bookingId, userId },
    });

    if (existingReview) {
      throw new ApiError(400, "You have already reviewed this booking");
    }

    // 3. Create review linked with listing & guide
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        guideId,
        listingId: booking.listingId,
        bookingId: booking.id,
      },
    });

    return review;
  },

  getReviewsForGuide: async (guideId: string) => {
    return prisma.review.findMany({
      where: { guideId },
      include: {
        user: { select: { id: true, name: true, profilePic: true } },
        listing: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getReviewsForListing: async (listingId: string) => {
    return prisma.review.findMany({
      where: { listingId },
      include: {
        user: { select: { id: true, name: true, profilePic: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};

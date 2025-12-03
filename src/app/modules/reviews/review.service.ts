import prisma from "../../shared/prisma";

export const reviewService = {
  createReview: async (payload: any, userId: string) => {
    // Check if booking is completed? (you can enforce stronger rule later)
    const booking = await prisma.booking.findFirst({
      where: { tourId: payload.tourId, userId, status: "COMPLETED" },
    });

    if (!booking)
      throw new Error("You can only review after completing a tour.");

    return prisma.review.create({
      data: { ...payload, userId },
    });
  },

  getReviewsForGuide: async (guideId: string) => {
    return prisma.review.findMany({
      where: { guideId },
      include: { user: true },
    });
  },

  getReviewsForTour: async (tourId: string) => {
    return prisma.review.findMany({
      where: { tourId },
      include: { user: true },
    });
  },
};

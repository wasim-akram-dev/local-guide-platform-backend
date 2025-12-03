import prisma from "../../shared/prisma";

const createTour = async (guideId: string, payload: any) => {
  return await prisma.tour.create({
    data: { ...payload, guideId },
  });
};

const getAllTours = async () => {
  return prisma.tour.findMany({
    include: { guide: true },
  });
};

const getSingleTour = async (id: string) => {
  return prisma.tour.findUnique({
    where: { id },
    include: { guide: true },
  });
};

const updateTour = async (id: string, payload: any, guideId: string) => {
  // Prevent updating another guide's tour
  return prisma.tour.updateMany({
    where: { id, guideId },
    data: payload,
  });
};

const deleteTour = async (id: string, guideId: string) => {
  return prisma.tour.deleteMany({
    where: { id, guideId },
  });
};

export const TourService = {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};

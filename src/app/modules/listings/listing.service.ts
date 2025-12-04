import prisma from "../../shared/prisma";

const createListing = async (guideId: string, payload: any) => {
  const listing = await prisma.listing.create({
    data: { ...payload, guideId },
  });
  return listing;
};

const getListings = async () => {
  return await prisma.listing.findMany({ include: { guide: true } });
};

const getListingById = async (id: string) => {
  return await prisma.listing.findUnique({
    where: { id },
    include: { guide: true, bookings: true },
  });
};

const updateListing = async (id: string, guideId: string, payload: any) => {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new Error("Listing not found");
  if (listing.guideId !== guideId) throw new Error("Unauthorized");

  return await prisma.listing.update({
    where: { id },
    data: payload,
  });
};

const deleteListing = async (id: string, guideId: string) => {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new Error("Listing not found");
  if (listing.guideId !== guideId) throw new Error("Unauthorized");

  return await prisma.listing.delete({ where: { id } });
};

export const ListingsService = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
};

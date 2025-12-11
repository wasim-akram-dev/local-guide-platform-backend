import prisma from "../../shared/prisma";

const createListing = async (guideId: string, payload: any) => {
  console.log(guideId, payload);
  return prisma.listing.create({
    data: { ...payload, guideId },
    include: {
      guide: {
        select: { id: true, name: true, email: true, profilePic: true },
      },
    },
  });
};

const getListings = async (query: any) => {
  const { category, city, priceMin, priceMax, duration, search, guideId } =
    query;

  const filters: any = { active: true };

  if (guideId) filters.guideId = guideId;

  if (category) filters.category = category;
  if (city) filters.city = { contains: city, mode: "insensitive" };
  if (duration) filters.duration = Number(duration);
  if (priceMin || priceMax)
    filters.tourFee = {
      ...(priceMin && { gte: Number(priceMin) }),
      ...(priceMax && { lte: Number(priceMax) }),
    };
  if (search) filters.title = { contains: search, mode: "insensitive" };

  return prisma.listing.findMany({
    where: filters,
    include: { guide: true, reviews: true },
    orderBy: { createdAt: "desc" },
  });
};

const getListingById = async (id: string) => {
  return await prisma.listing.findUnique({
    where: { id },
    include: {
      guide: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePic: true,
          bio: true,
          languages: true,
          expertise: true,
          // phone: true,
          // add more if needed
        },
      },
      bookings: {
        select: {
          id: true,
          date: true,
          status: true, // Pending/Approved/etc.
        },
      },
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, profilePic: true },
          },
        },
      },
    },
  });
};

const updateListing = async (id: string, guideId: string, payload: any) => {
  console.log(id, guideId, payload);
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new Error("Listing not found");
  // if (listing.guideId !== guideId) throw new Error("Unauthorized");

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

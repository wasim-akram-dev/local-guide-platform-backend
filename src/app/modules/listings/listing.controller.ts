import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ListingsService } from "./listing.service";

const createListing = catchAsync(async (req: any, res: Response) => {
  const guideId = req.user.id;
  const result = await ListingsService.createListing(guideId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Listing created",
    data: result,
  });
});

const getListings = catchAsync(async (_req: Request, res: Response) => {
  const result = await ListingsService.getListings();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listings retrieved",
    data: result,
  });
});

const getListingById = catchAsync(async (req: Request, res: Response) => {
  const result = await ListingsService.getListingById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing retrieved",
    data: result,
  });
});

const updateListing = catchAsync(async (req: any, res: Response) => {
  const guideId = req.user.id;
  const result = await ListingsService.updateListing(
    req.params.id,
    guideId,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing updated",
    data: result,
  });
});

const deleteListing = catchAsync(async (req: any, res: Response) => {
  const guideId = req.user.id;
  const result = await ListingsService.deleteListing(req.params.id, guideId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing deleted",
    data: result,
  });
});

export const ListingsController = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
};

import { Request, Response } from "express";
import { reviewService } from "./review.service";
import { createReviewSchema } from "./review.validation";

export const createReviewController = async (req: any, res: Response) => {
  try {
    const validatedData = createReviewSchema.parse(req.body);

    const review = await reviewService.createReview(validatedData, req.user.id);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGuideReviews = async (req: Request, res: Response) => {
  const result = await reviewService.getReviewsForGuide(req.params.guideId);
  res.json({ success: true, data: result });
};

export const getListingReviews = async (req: Request, res: Response) => {
  const result = await reviewService.getReviewsForListing(req.params.listingId);
  res.json({ success: true, data: result });
};

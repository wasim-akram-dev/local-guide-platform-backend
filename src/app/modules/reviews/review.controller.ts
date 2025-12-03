import { Request, Response } from "express";
import { reviewService } from "./review.service";
import { createReviewSchema } from "./review.validation";

export const createReviewController = async (req: any, res: Response) => {
  const { success, data, error } = createReviewSchema.safeParse(req.body);
  if (!success)
    return res.status(400).json({ message: error.issues[0].message });

  try {
    const result = await reviewService.createReview(data, req.user.id);
    res.status(201).json({ success: true, review: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getGuideReviews = async (req: Request, res: Response) => {
  const result = await reviewService.getReviewsForGuide(req.params.guideId);
  res.json(result);
};

export const getTourReviews = async (req: Request, res: Response) => {
  const result = await reviewService.getReviewsForTour(req.params.tourId);
  res.json(result);
};

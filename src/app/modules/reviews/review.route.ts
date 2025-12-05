import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import {
  createReviewController,
  getGuideReviews,
  getListingReviews,
} from "./review.controller";

const router = Router();

// Only TOURIST can create review & only after booking completed
router.post("/", authGuard("TOURIST"), createReviewController);

// Public — anyone can view reviews
router.get("/guide/:guideId", getGuideReviews);
router.get("/listing/:listingId", getListingReviews);

export const ReviewRoutes = router;

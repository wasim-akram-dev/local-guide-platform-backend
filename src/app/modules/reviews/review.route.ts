import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import {
  createReviewController,
  getGuideReviews,
  getTourReviews,
} from "./review.controller";

const router = Router();

router.post("/", authGuard("TOURIST"), createReviewController);
router.get("/guide/:guideId", getGuideReviews);
router.get("/tour/:tourId", getTourReviews);

export const ReviewsRoutes = router;

// await fetch("/api/reviews", {
//   method: "POST",
//   body: JSON.stringify({
//     tourId,
//     guideId,
//     rating: 5,
//     comment: "Amazing guide, very friendly!",
//   }),
// });

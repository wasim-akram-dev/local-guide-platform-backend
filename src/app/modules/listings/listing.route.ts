import express from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { ListingsController } from "./listing.controller";
import { createListingSchema, updateListingSchema } from "./listing.validation";

const router = express.Router();

// All routes require authentication
// router.use(authGuard);
// router.use(authGuard());
// router.use(authGuard());

// POST	/api/listings	Create listing (Guide only)
router.post(
  "/",
  authGuard("GUIDE"),
  validateRequest(createListingSchema),
  ListingsController.createListing
);

// GET	/api/listings	Search + filters
router.get("/", ListingsController.getListings);

// GET	/api/listings/:id	Get listing details
router.get("/:id", ListingsController.getListingById);

// PATCH	/api/listings/:id	Update listing
// Only guide who created the tour can update/delete
router.patch(
  "/:id",
  authGuard("GUIDE"),
  validateRequest(updateListingSchema),
  ListingsController.updateListing
);

// DELETE	/api/listings/:id	Deactivate listing
router.delete("/:id", authGuard("GUIDE"), ListingsController.deleteListing);

export const ListingsRoutes = router;

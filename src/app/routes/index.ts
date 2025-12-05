import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookingsRoutes } from "../modules/bookings/booking.route";
import { ListingsRoutes } from "../modules/listings/listing.route";
import { ReviewRoutes } from "../modules/reviews/review.route";
import { UsersRoutes } from "../modules/users/user.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UsersRoutes,
  },
  {
    path: "/listings",
    route: ListingsRoutes,
  },
  {
    path: "/bookings",
    route: BookingsRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookingsRoutes } from "../modules/booking/booking.route";
import { ToursRoutes } from "../modules/tours/tours.route";
import { UsersRoutes } from "../modules/users/users.route";

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
    path: "/tours",
    route: ToursRoutes,
  },
  {
    path: "/bookings",
    route: BookingsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

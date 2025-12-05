import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import {
  getAllPayments,
  getMyPayments,
  makePayment,
} from "./payment.controller";

const router = Router();

// Tourist can pay
router.post("/", authGuard("TOURIST"), makePayment);

// Tourist can view own payments
router.get("/my", authGuard("TOURIST"), getMyPayments);

// Admin can view all payments
router.get("/", authGuard("ADMIN"), getAllPayments);

export const PaymentRoutes = router;

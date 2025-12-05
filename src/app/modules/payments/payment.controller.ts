import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { createPaymentSchema } from "./payment.validation";

export const makePayment = async (req: any, res: Response) => {
  try {
    const data = createPaymentSchema.parse(req.body);
    const result = await paymentService.createPayment(data, req.user.id);

    res.status(201).json({
      success: true,
      message: "Payment successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyPayments = async (req: any, res: Response) => {
  const result = await paymentService.getPaymentsForUser(req.user.id);
  res.json({ success: true, data: result });
};

export const getAllPayments = async (req: Request, res: Response) => {
  const result = await paymentService.getAllPayments();
  res.json({ success: true, data: result });
};

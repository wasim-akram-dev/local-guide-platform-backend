import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

export const paymentService = {
  createPayment: async (payload: any, userId: string) => {
    const { bookingId, amount, transactionId } = payload;

    // 1. Check booking exists & belongs to user
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, touristId: userId, status: "ACCEPTED" },
      include: { payments: true },
    });

    if (!booking)
      throw new ApiError(400, "Booking not found or not payable yet");

    // 2. Prevent double payment
    if (booking.payments.length > 0)
      throw new ApiError(400, "Payment already completed for this booking");

    // 3. Verify amount matches booking cost (optional strict check)
    if (booking.totalPrice !== amount)
      throw new ApiError(400, "Invalid payment amount");

    // 4. Create payment
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        transactionId,
        status: "SUCCESS", // Later update from gateway webhook
      },
    });

    // 5. Mark booking as COMPLETED or PAID (optional decision)
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" }, // If you want "PAID", create new status
    });

    return payment;
  },

  getPaymentsForUser: async (userId: string) =>
    prisma.payment.findMany({
      where: { booking: { touristId: userId } },
      include: { booking: true },
    }),

  getAllPayments: async () =>
    prisma.payment.findMany({ include: { booking: true } }),
};

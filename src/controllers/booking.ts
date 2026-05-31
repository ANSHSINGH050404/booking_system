import { prisma } from "../../db";
import type { AuthReq } from "./auth";
import type { Response } from "express";

export const createBooking = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { showId, seatIds } = req.body;

  if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res
      .status(400)
      .json({ message: "showId and seatIds array are required" });
  }

  const show = await prisma.show.findFirst({
    where: { id: showId },
    include: { screen: true },
  });

  if (!show) {
    return res.status(404).json({ message: "Show not found" });
  }

  const showSeats = await prisma.showSeat.findMany({
    where: {
      showId,
      seatId: { in: seatIds },
    },
  });

  if (showSeats.length !== seatIds.length) {
    return res.status(400).json({ message: "Some seats do not exist for this show" });
  }

  const unavailable = showSeats.filter((s) => s.status !== "AVAILABLE");
  if (unavailable.length > 0) {
    return res.status(409).json({
      message: "Some seats are already booked or locked",
      seats: unavailable.map((s) => s.seatId),
    });
  }

  const bookings = await prisma.$transaction(async (tx) => {
    const created = [];

    for (const seatId of seatIds) {
      await tx.showSeat.update({
        where: { showId_seatId: { showId, seatId } },
        data: { status: "BOOKED" },
      });

      const booking = await tx.booking.create({
        data: {
          userId,
          seatId,
          theaterId: show.screen.theaterId,
          screenId: show.screenId,
        },
      });

      created.push(booking);
    }

    return created;
  });

  return res.status(201).json({ bookings });
};

export const getUserBookings = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      seat: true,
      screen: true,
      theater: true,
    },
  });

  return res.json({ bookings });
};

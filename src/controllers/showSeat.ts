import { prisma } from "../../db";
import type { AuthReq } from "./auth";
import type { Response } from "express";

export const getShowSeatsByShow = async (req: AuthReq, res: Response) => {
  const { showId } = req.params as { showId: string };

  const showSeats = await prisma.showSeat.findMany({
    where: { showId },
    include: { seat: true },
  });

  return res.json({ showSeats });
};

export const lockShowSeat = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { showId, seatId } = req.body;

  if (!showId || !seatId) {
    return res.status(400).json({ message: "showId and seatId are required" });
  }

  const showSeat = await prisma.showSeat.findUnique({
    where: { showId_seatId: { showId, seatId } },
  });

  if (!showSeat) {
    return res.status(404).json({ message: "Show seat not found" });
  }

  if (showSeat.status !== "AVAILABLE") {
    return res.status(409).json({ message: "Seat is not available" });
  }

  const updated = await prisma.showSeat.update({
    where: { showId_seatId: { showId, seatId } },
    data: {
      status: "LOCKED",
      lockedBy: userId,
      lockExpiry: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return res.json({ showSeat: updated });
};

export const releaseShowSeat = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { showId, seatId } = req.body;

  if (!showId || !seatId) {
    return res.status(400).json({ message: "showId and seatId are required" });
  }

  const showSeat = await prisma.showSeat.findUnique({
    where: { showId_seatId: { showId, seatId } },
  });

  if (!showSeat) {
    return res.status(404).json({ message: "Show seat not found" });
  }

  if (showSeat.lockedBy !== userId) {
    return res.status(403).json({ message: "Seat is locked by another user" });
  }

  const updated = await prisma.showSeat.update({
    where: { showId_seatId: { showId, seatId } },
    data: {
      status: "AVAILABLE",
      lockedBy: null,
      lockExpiry: null,
    },
  });

  return res.json({ showSeat: updated });
};

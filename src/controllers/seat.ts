import { prisma } from "../../db";
import type { AuthReq } from "./auth";
import type { Response } from "express";

export const createSeat = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { screenId, row, number } = req.body;

  if (!screenId || !row || !number) {
    return res
      .status(400)
      .json({ message: "screenId, row, and number are required" });
  }

  const screen = await prisma.screen.findFirst({ where: { id: screenId } });
  if (!screen) {
    return res.status(404).json({ message: "Screen not found" });
  }

  const seat = await prisma.seat.create({
    data: { screenId, row, number },
  });

  return res.status(201).json({ seat });
};

export const getSeatsByScreen = async (req: AuthReq, res: Response) => {
  const { screenId } = req.params as { screenId: string };

  const seats = await prisma.seat.findMany({
    where: { screenId },
  });

  return res.json({ seats });
};

export const updateSeat = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params as { id: string };
  const { row, number } = req.body;

  const existing = await prisma.seat.findFirst({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Seat not found" });
  }

  const seat = await prisma.seat.update({
    where: { id },
    data: { row, number },
  });

  return res.json({ seat });
};

export const deleteSeat = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params as { id: string };

  const existing = await prisma.seat.findFirst({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Seat not found" });
  }

  await prisma.seat.delete({ where: { id } });

  return res.json({ message: "Seat deleted" });
};

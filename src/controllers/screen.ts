import { prisma } from "../../db";
import type { AuthReq } from "./auth";
import type { Response } from "express";

export const createScreen = async (req: AuthReq, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, theaterId } = req.body;

  if (!name || !theaterId) {
    return res.status(400).json({ message: "name and theaterId are required" });
  }

  const screen = await prisma.screen.create({
    data: { name, theaterId },
  });

  return res.status(201).json({ screen });
};

export const getAllScreens = async (req: AuthReq, res: Response) => {
  const screens = await prisma.screen.findMany({
    include: { theater: true, seats: true },
  });

  return res.json({ screens });
};

export const getScreenByID = async (req: AuthReq, res: Response) => {
  const { id } = req.params as { id: string };

  const screen = await prisma.screen.findFirst({
    where: { id },
    include: { theater: true, seats: true },
  });

  if (!screen) {
    return res.status(404).json({ message: "Screen not found" });
  }

  return res.json({ screen });
};

export const getScreensByTheater = async (req: AuthReq, res: Response) => {
  const { theaterId } = req.params as { theaterId: string };

  const screens = await prisma.screen.findMany({
    where: { theaterId },
    include: { seats: true },
  });

  return res.json({ screens });
};

export const updateScreen = async (req: AuthReq, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params as { id: string };
  const { name, theaterId } = req.body;

  const existing = await prisma.screen.findFirst({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Screen not found" });
  }

  const screen = await prisma.screen.update({
    where: { id },
    data: { name, theaterId },
  });

  return res.json({ screen });
};

export const deleteScreen = async (req: AuthReq, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params as { id: string };

  const existing = await prisma.screen.findFirst({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Screen not found" });
  }

  await prisma.screen.delete({ where: { id } });

  return res.json({ message: "Screen deleted" });
};

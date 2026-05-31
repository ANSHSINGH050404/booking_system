import type { Response } from "express";
import type { AuthReq } from "./auth";
import { prisma } from "../../db";

export const createTheater = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, city } = req.body;

  if (!name || !city) {
    return res.status(400).json({ message: "name and city are required" });
  }

  await prisma.theater.create({
    data: { name, city },
  });

  return res.status(201).json({ message: "Theater created" });
};

export const getAllTheaters = async (_req: AuthReq, res: Response) => {
  const theaters = await prisma.theater.findMany({
    include: { screens: true },
  });

  return res.json({ theaters });
};

export const getTheaterById = async (req: AuthReq, res: Response) => {
  const { id } = req.params as { id: string };

  const theater = await prisma.theater.findFirst({
    where: { id },
    include: { screens: true },
  });

  if (!theater) {
    return res.status(404).json({ message: "Theater not found" });
  }

  return res.json({ theater });
};

export const getTheatersByCity = async (req: AuthReq, res: Response) => {
  const { city } = req.params as { city: string };

  const theaters = await prisma.theater.findMany({
    where: { city },
    include: { screens: true },
  });

  return res.json({ theaters });
};

export const updateTheater = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params as { id: string };
  const { name, city } = req.body;

  const existing = await prisma.theater.findFirst({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Theater not found" });
  }

  const theater = await prisma.theater.update({
    where: { id },
    data: { name, city },
  });

  return res.json({ theater });
};

export const deleteTheater = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params as { id: string };

  const existing = await prisma.theater.findFirst({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Theater not found" });
  }

  await prisma.theater.delete({ where: { id } });

  return res.json({ message: "Theater deleted" });
};

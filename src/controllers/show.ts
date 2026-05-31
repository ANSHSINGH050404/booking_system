import { prisma } from "../../db";
import type { AuthReq } from "./auth";
import type { Response } from "express";

export const createShow = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { movieId, screenId, startTime } = req.body;

  if (!movieId || !screenId || !startTime) {
    return res
      .status(400)
      .json({ message: "movieId, screenId, and startTime are required" });
  }

  const movie = await prisma.movie.findFirst({ where: { id: movieId } });
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const screen = await prisma.screen.findFirst({ where: { id: screenId } });
  if (!screen) {
    return res.status(404).json({ message: "Screen not found" });
  }

  const seats = await prisma.seat.findMany({ where: { screenId } });

  const show = await prisma.show.create({
    data: {
      movieId,
      screenId,
      startTime: new Date(startTime),
      showSeats: {
        create: seats.map((s) => ({
          seatId: s.id,
          status: "AVAILABLE",
        })),
      },
    },
    include: { showSeats: true },
  });

  return res.status(201).json({ show });
};

export const getAllShows = async (_req: AuthReq, res: Response) => {
  const shows = await prisma.show.findMany({
    include: { movie: true, screen: { include: { theater: true } } },
  });

  return res.json({ shows });
};

export const getShowByID = async (req: AuthReq, res: Response) => {
  const { id } = req.params as { id: string };

  const show = await prisma.show.findFirst({
    where: { id },
    include: { movie: true, screen: { include: { theater: true } } },
  });

  if (!show) {
    return res.status(404).json({ message: "Show not found" });
  }

  return res.json({ show });
};

export const getShowsByMovie = async (req: AuthReq, res: Response) => {
  const { movieId } = req.params as { movieId: string };

  const shows = await prisma.show.findMany({
    where: { movieId },
    include: { screen: { include: { theater: true } } },
  });

  return res.json({ shows });
};

export const getShowsByScreen = async (req: AuthReq, res: Response) => {
  const { screenId } = req.params as { screenId: string };

  const shows = await prisma.show.findMany({
    where: { screenId },
    include: { movie: true },
  });

  return res.json({ shows });
};

export const updateShow = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params as { id: string };
  const { movieId, screenId, startTime } = req.body;

  const existing = await prisma.show.findFirst({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Show not found" });
  }

  const show = await prisma.show.update({
    where: { id },
    data: {
      ...(movieId && { movieId }),
      ...(screenId && { screenId }),
      ...(startTime && { startTime: new Date(startTime) }),
    },
  });

  return res.json({ show });
};

export const deleteShow = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params as { id: string };

  const existing = await prisma.show.findFirst({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Show not found" });
  }

  await prisma.show.delete({ where: { id } });

  return res.json({ message: "Show deleted" });
};
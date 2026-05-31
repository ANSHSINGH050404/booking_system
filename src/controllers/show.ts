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

  const show = await prisma.show.create({
    data: {
      movieId,
      screenId,
      startTime: new Date(startTime),
    },
  });

  return res.status(201).json({ show });
};
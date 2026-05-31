import { prisma } from "../../db";
import type { AuthReq } from "./auth";
import type { Response } from "express";

export const createMovie = async (req: AuthReq, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, description, language, duration } = req.body;

  console.log(title, description, language, duration);
  if (!title || !description || !language || !duration) {
    return res
      .status(400)
      .json({
        message: "title, description, language, and duration are required",
      });
  }

  await prisma.movie.create({
    data: {
      title,
      description,
      language,
      duration,
    },
  });
  return res.status(201).json({ message: "Movie created" });
};

export const getMovieByID = async (req: AuthReq, res: Response) => {
  const { id: movieId } = req.params;

  const data = await prisma.movie.findFirst({
    where: { id: movieId },
  });

  if (!data) {
    res.status(404).json({ message: "Movie not found" });
    return;
  }

  res.json({ data});
};

export const getAllMovie = async (req: AuthReq, res: Response) => {
  const movies = await prisma.movie.findMany({});

  res.json({ movies });
};

import type { Response } from "express";
import type { AuthReq } from "./auth";
import { prisma } from "../../db";

export const Theater = async (req: AuthReq, res: Response) => {
  const { name, city } = req.body;

  if (!name || !city) {
    return;
  }

  await prisma.theater.create({
    data: {
      name,
      city,
    },
  });

  res.status(201).json({
    message: "Sucessfull",
  });
};

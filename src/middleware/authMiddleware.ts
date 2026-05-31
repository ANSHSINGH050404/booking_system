import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import type { AuthReq } from "../controllers/auth";

export const authenticated = (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  // console.log(token);
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  req.userId = decoded.userId;
  next();
};

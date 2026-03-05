import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  if (req.user!.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};

export const sellerOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  if (req.user!.role !== "SELLER") {
    return res.status(403).json({ message: "Seller only" });
  }

  next();
};
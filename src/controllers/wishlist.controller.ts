import { Response } from "express";
import prisma from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const addToWishlist = async (req: AuthRequest, res: Response) => {

  const { productId } = req.body;

  const item = await prisma.wishlist.create({
    data: {
      userId: req.user!.id,
      productId
    }
  });

  res.json(item);
};

export const getWishlist = async (req: AuthRequest, res: Response) => {

  const items = await prisma.wishlist.findMany({
    where: { userId: req.user!.id },
    include: { product: true }
  });

  res.json(items);
};
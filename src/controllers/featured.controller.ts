import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const addFeatured = async (req: Request, res: Response) => {

  const { productId } = req.body;

  const featured = await prisma.featured.create({
    data: { productId }
  });

  res.json(featured);
};

export const getFeatured = async (_: Request, res: Response) => {

  const items = await prisma.featured.findMany({
    include: { product: true }
  });

  res.json(items);
};
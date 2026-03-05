import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const createProduct = async (req: any, res: Response) => {

  const product = await prisma.product.create({
    data: {
      ...req.body,
      sellerId: req.user.id
    }
  });

  res.json(product);
};

export const getProducts = async (_: Request, res: Response) => {

  const products = await prisma.product.findMany({
    include: { featured: true }
  });

  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  try {
  
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};
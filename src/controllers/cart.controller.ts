import { Response } from "express";
import prisma from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";


export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId, quantity } = req.body;

    
    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
     
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return res.json(updatedItem);
    }

    
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    res.json(newItem);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const viewCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
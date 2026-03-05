import { Response } from "express";
import prisma from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";



export const createOrder = async (req: AuthRequest, res: Response) => {

  try {

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cart.items.reduce(
      (sum: number, item) =>
        sum + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: { items: true }
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.json(order);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Order creation failed" });

  }
};




export const getOrders = async (req: AuthRequest, res: Response) => {

  try {

    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(orders);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });

  }
};




export const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};
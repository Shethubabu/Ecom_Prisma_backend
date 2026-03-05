import express from "express";

import { register, login } from "../controllers/auth.controller.js";

import {
  createProduct,
  getProducts,
  getProductById
} from "../controllers/product.controller.js";

import {
  addToCart,
  viewCart
} from "../controllers/cart.controller.js";

import {
  createOrder,
  getOrders,
  getOrderDetails
} from "../controllers/order.controller.js";

import {
  addToWishlist,
  getWishlist
} from "../controllers/wishlist.controller.js";

import {
  addFeatured,
  getFeatured
} from "../controllers/featured.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly, sellerOnly } from "../middleware/role.middleware.js";

const router = express.Router();



router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/products", getProducts);

router.get("/products/:id", getProductById); 

router.post(
  "/products",
  authMiddleware,
  sellerOnly,
  createProduct
);




router.post(
  "/cart",
  authMiddleware,
  addToCart
);

router.get(
  "/cart",
  authMiddleware,
  viewCart
);




router.post(
  "/wishlist",
  authMiddleware,
  addToWishlist
);

router.get(
  "/wishlist",
  authMiddleware,
  getWishlist
);




router.post(
  "/orders",
  authMiddleware,
  createOrder
);

router.get(
  "/orders",
  authMiddleware,
  getOrders
);

router.get(
  "/orders/:id",
  authMiddleware,
  getOrderDetails
);




router.post(
  "/featured",
  authMiddleware,
  adminOnly,
  addFeatured
);

router.get(
  "/featured",
  getFeatured
);

export default router;
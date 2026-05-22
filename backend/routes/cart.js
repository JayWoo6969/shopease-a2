const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "shopease_secret");
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.user.id }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ sessionId: req.user.id });

    if (!cart) {
      cart = await Cart.create({ sessionId: req.user.id, items: [{ product: productId, quantity: 1 }] });
    } else {
      const existing = cart.items.find(item => item.product.toString() === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
      await cart.save();
    }

    cart = await Cart.findOne({ sessionId: req.user.id }).populate("items.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:productId", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ sessionId: req.user.id });
    const item = cart.items.find(item => item.product.toString() === req.params.productId);
    if (item) item.quantity = quantity;
    await cart.save();
    const updated = await Cart.findOne({ sessionId: req.user.id }).populate("items.product");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.user.id });
    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    const updated = await Cart.findOne({ sessionId: req.user.id }).populate("items.product");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.userId }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    description: "Premium sound quality with 30-hour battery life.",
    stock: 15,
  },
  {
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    description: "Tactile switches with RGB backlight.",
    stock: 22,
  },
  {
    name: "Running Sneakers",
    category: "Footwear",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    description: "Lightweight with responsive foam cushioning.",
    stock: 30,
  },
  {
    name: "Minimalist Backpack",
    category: "Bags",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    description: "Water-resistant 20L with laptop compartment.",
    stock: 18,
  },
  {
    name: "Water Bottle",
    category: "Lifestyle",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    description: "Keeps drinks cold 24h or hot 12h.",
    stock: 50,
  },
  {
    name: "Yoga Mat",
    category: "Sports",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    description: "Non-slip 6mm thick mat with carry strap.",
    stock: 25,
  },
  {
    name: "Pringles Can",
    category: "Food",
    price: 4.99,
    image: "/images/pringles.jpg",
    description: "Once you pop you can't stop. Original flavour.",
    stock: 100,
  },
  {
    name: "Rubber Gloves",
    category: "Kitchen",
    price: 6.99,
    image: "/images/glove.jpg",
    description: "Heavy duty latex gloves for cleaning and washing.",
    stock: 60,
  },
  {
    name: "Kitchen Sponge",
    category: "Kitchen",
    price: 3.99,
    image: "/images/sponge.jpg",
    description: "Dual-sided sponge for tough grease and delicate surfaces.",
    stock: 200,
  },
];

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shopease2")
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Database seeded with 9 products!");
    process.exit();
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
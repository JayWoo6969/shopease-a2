require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shopease")
  .then(async () => {
    const products = await Product.find();
    const carts = await Cart.find();

    fs.writeFileSync("../database/products.json", JSON.stringify(products, null, 2));
    fs.writeFileSync("../database/carts.json", JSON.stringify(carts, null, 2));

    console.log("Exported products.json and carts.json to database folder!");
    process.exit();
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
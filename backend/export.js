require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const User = require("./models/User");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shopease2")
  .then(async () => {
    const products = await Product.find();
    const carts = await Cart.find();
    const users = await User.find().select("-password");

    fs.writeFileSync("../database/products.json", JSON.stringify(products, null, 2));
    fs.writeFileSync("../database/carts.json", JSON.stringify(carts, null, 2));
    fs.writeFileSync("../database/users.json", JSON.stringify(users, null, 2));

    console.log("Exported products, carts and users to database folder!");
    process.exit();
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
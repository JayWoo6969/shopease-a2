require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shopease2")
  .then(async () => {
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@shopease.com",
      password: hash,
      role: "admin"
    });
    console.log("Admin created!");
    process.exit();
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
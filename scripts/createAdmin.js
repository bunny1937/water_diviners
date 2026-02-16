import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config({ path: ".env.local" });

async function createAdmin() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing in .env.local");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await Admin.findOne({
    email: process.env.ADMIN_EMAIL,
  });

  if (existing) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

  await Admin.create({
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
  });

  console.log("Admin created successfully.");
  process.exit(0);
}

createAdmin();

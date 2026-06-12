import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

const addFood = async (req, res) => {
  const { name, description, price, category } = req.body || {};

  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Food image is required" });
  }

  if (!name || !description || !category || !price) {
    return res
      .status(400)
      .json({ success: false, message: "All food fields are required" });
  }

  const priceValue = Number(price);
  if (Number.isNaN(priceValue) || priceValue < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid price" });
  }

  const image_filename = req.file.filename;

  const food = new foodModel({
    name,
    description,
    price: priceValue,
    category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food item added successfully" });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ success: false, message: "Error adding food item" });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching food items" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }

    const imagePath = path.join("uploads", food.image);
    fs.unlink(imagePath, (unlinkError) => {
      if (unlinkError && unlinkError.code !== "ENOENT") {
        console.error("Failed to remove image file:", unlinkError);
      }
    });

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food item removed successfully" });
  } catch (error) {
    console.error("Error removing food item:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing food item" });
  }
};

export { addFood, listFood, removeFood };

import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  let image = `${req.file.filename}`;
  const { name, description, price, category } = req.body;
  const food = new foodModel({
    name,
    description,
    price,
    category,
    image,
  });
  try {
    await food.save();
    res.status(200).json({ success: true, message: "Food added!", food });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Food not added!" });
  }
};
const foodList = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res
      .status(200)
      .json({ success: true, message: "Food retrieved", data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Food not retrieved!" });
  }
};
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      res.status(404).json({ success: false, message: "Food Item not found!" });
    }
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Food removed", data: food });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Food not removed!" });
  }
};
export { addFood, foodList, removeFood };

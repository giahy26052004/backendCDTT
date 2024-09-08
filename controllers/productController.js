import { Product } from "../model/productModel.js";

const addProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("products", products);
    let id;
    if (products.length > 0) {
      console.log("id", products[products.length - 1].id + 1);
      id = products[products.length - 1].id + 1;
    } else {
      id = 1;
    }
    console.log("id", id);
    const { name, new_price, old_price, category, image } = req.body;
    const newProduct = new Product({
      id,
      name,
      new_price,
      old_price,
      category,
      image,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await Product.findOneAndDelete({ id: id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCartbyId = async (req, res) => {
  const { id } = req.body;
  const cart = await Product.find({ id: id });
  res.status(200).json(cart);
};
const newCollection = async (req, res) => {
  let products = await Product.find({});
  let newCollection = await products.slice(1).slice(-8);
  res.send(newCollection);
};
const popularinwomen = async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popularinwomen = await products.slice(0, 4);
  res.send(popularinwomen);
};

export {
  popularinwomen,
  addProduct,
  removeProduct,
  getAllProduct,
  newCollection,
  getCartbyId,
};

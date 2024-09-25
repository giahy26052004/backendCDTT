import { Product } from "../model/productModel.js";

const addProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      console.log("id", products[products.length - 1].id + 1);
      id = products[products.length - 1].id + 1;
    } else {
      id = 1;
    }
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
// REMOVE PRODUCT
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await Product.findOneAndDelete({ id: id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//GET ALL PRODUCT
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//GETCART BY ID
const getCartbyId = async (req, res) => {
  const { id } = req.body;
  const cart = await Product.find({ id: id });
  res.status(200).json(cart);
};
//NEWCOLECTIONS
const newCollection = async (req, res) => {
  let products = await Product.find({});
  let newCollection = await products.slice(1).slice(-8);
  res.send(newCollection);
};
//popularinwomen
const popularinwomen = async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popularinwomen = await products.slice(0, 4);
  res.send(popularinwomen);
};
//SEARCH PRODUCTS
const searchProducts = async (req, res) => {
  const { name } = req.query; // Lấy giá trị 'name' từ tham số truy vấn

  try {
    const results = await Product.find({
      name: { $regex: name, $options: "i" }, // Tìm kiếm sản phẩm dựa trên tên
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error searching products", error });
  }
};
// EDIT PRODUCT
const editProduct = async (req, res) => {
  const { id, name, new_price, old_price, category, image } = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: id },
      { name, new_price, old_price, category, image },
      { new: true } // Return the updated document
    );
    console.log(updatedProduct);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  popularinwomen,
  addProduct,
  searchProducts,
  editProduct,
  removeProduct,
  getAllProduct,
  newCollection,
  getCartbyId,
};

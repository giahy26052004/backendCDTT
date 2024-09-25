import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  addProduct,
  getAllProduct,
  removeProduct,
  popularinwomen,
  newCollection,
  getCartbyId,
  searchProducts,
} from "./controllers/productController.js"; // Sửa: dùng import
import "dotenv/config"; // Đảm bảo nạp biến môi trường
import { addUser, loginUser } from "./controllers/UserController.js";
import {
  addToCart,
  getCartData,
  removeFromCart,
} from "./controllers/cartController.js";
import { fetchUserToken } from "./midleware/fetchUserToken.js";
import { checkout, getOrderData } from "./controllers/orderController.js";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryConfig = cloudinary.v2;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());
console.log(process.env.MONGODB_URI);

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected with MongoDB"))
  .catch((err) => console.error("Error connect with MongoDB:", err));

// Configure Cloudinary
cloudinaryConfig.config({
  cloud_name: "difmknbax",
  api_key: "245937446394184",
  api_secret: "3z6PuFI5lPLKmAYUPdgIRlDiKEI",
});

cloudinaryConfig.api.ping((error, result) => {
  if (error) {
    console.error("Cloudinary connection error:", error);
  } else {
    console.log("Connected to Cloudinary:", result);
  }
});

// Create Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: {
    folder: "uploads/images",
    format: async (req, file) => {
      return await path.extname(file.originalname).substring(1);
    },
    public_id: (req, file) => {
      return `${Date.now()}-${file.fieldname}`;
    },
  },
});

const upload = multer({ storage: storage });

// Routes
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded." });
  }
  res.json({
    success: 1,
    image_url: req.file.path,
  });
});
// Routes /index
app.get("/", (req, res) => {
  res.send("HelloExpress!");
});
//-------------------------------------------
//PRODUCT ROUTES
//-------------------------------------------
// Upload image
app.use("/images", express.static(path.join(__dirname, "upload/images"))); // Sửa: Sử dụng path.join và __dirname

// addProduct
app.post("/addProduct", addProduct);
///removeProduct
app.delete("/removeProduct", removeProduct);
// getAllProduct
app.get("/allproducts", getAllProduct);
//NEW COLLECTION
app.get("/newcollections", newCollection);
//WOMEN SECTION
app.get("/popularinwomen", popularinwomen);
//SEARCH
// Search products
app.get("/search", searchProducts);

//-------------------------------------------
//USER ROUTES
//-------------------------------------------
app.post("/signup", addUser);
app.post("/login", loginUser);
//

//CART ROUTES
app.post("/addtocart", fetchUserToken, addToCart);
app.get("/getcartbyid", getCartbyId);
app.post("/removefromcart", fetchUserToken, removeFromCart);
app.get("/getcart", fetchUserToken, getCartData);
//ORDER ROUTES
app.get("/orders", getOrderData);
app.post("/checkout", fetchUserToken, checkout);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

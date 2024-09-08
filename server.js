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

const storage = multer.diskStorage({
  destination: path.join(__dirname, "./upload/images"), // Sửa: Sử dụng path.join và __dirname
  filename: (req, file, cb) => {
    return cb(
      null,
      `${Date.now()}-${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Tạo thư mục nếu nó không tồn tại
const uploadDir = path.join(__dirname, "./upload/images"); // Sửa: Sử dụng path.join và __dirname
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes /index
app.get("/", (req, res) => {
  res.send("HelloExpress!");
});
//-------------------------------------------
//PRODUCT ROUTES
//-------------------------------------------
// Upload image
app.use("/images", express.static(path.join(__dirname, "upload/images"))); // Sửa: Sử dụng path.join và __dirname
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
  });
});
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

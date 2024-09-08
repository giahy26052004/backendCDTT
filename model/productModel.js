import mongoose from "mongoose";
import moment from "moment-timezone"; 

const { Schema, model, models } = mongoose;

const ProductSchema = new Schema({
  id: { type: Number, required: true }, 
  name: { type: String, required: true }, 
  image: { type: String, required: true }, 
  category: { type: String, required: true }, 
  new_price: { type: Number, required: true }, 
  old_price: { type: Number, required: true }, 
  date: {
    type: Date,
    default: () => moment().tz("Asia/Ho_Chi_Minh").format(), 
  },
  available: {
    type: Boolean,
    default: true,
  },
});

export const Product = models.Product || model("Product", ProductSchema);

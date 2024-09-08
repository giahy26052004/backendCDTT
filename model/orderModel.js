import mongoose from "mongoose";
const { model, models, Schema } = mongoose;

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    city: String,
    streetAddress: String,
    phone: Number,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);
export const Order = models?.Order || model("Order", OrderSchema);

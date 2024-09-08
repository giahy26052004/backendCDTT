import { Order } from "../model/orderModel.js";
import { Product } from "../model/productModel.js";
import User from "../model/userModel.js";

const checkout = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.user.id });

    const line_items = Object.entries(userData.cartData)
      .filter(([key, value]) => value !== 0)
      .map(([key, total]) => ({ id: key, quantity: total }));

    // Initialize with let instead of const to allow reassignment
    let updatedLineItems = [];

    if (line_items.length > 0) {
      const updatedLineItemsPromises = line_items.map(async (item) => {
        try {
          const product = await Product.findOne({ id: item.id });

          if (product) {
            item.product_data = product;
            item.price_data = product?.new_price * item.quantity;
          }
          return item; // Return the updated item
        } catch (error) {
          console.error(
            `Error fetching product for item ID ${item.id}:`,
            error
          );
          return item; // Return the item even if there was an error
        }
      });

      updatedLineItems = await Promise.all(updatedLineItemsPromises);
    }

    await Order.create({
      line_items: updatedLineItems,
      name: req.body.name,
      city: req.body.city,
      streetAddress: req.body.streetAddress,
      phone: req.body.phone,
      paid: false,
    });
    res.send({ message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ message: "Failed to create order" });
  }
};
const getOrderData = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

export { checkout, getOrderData };

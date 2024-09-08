import User from "../model/userModel.js";

const addToCart = async (req, res) => {
  const userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send({ message: "Add to cart successfully" });
};
const removeFromCart = async (req, res) => {
  const userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send({ message: "Remove from cart successfully" });
};
const getCartData = async (req, res) => {
  const userData = await User.findOne({ _id: req.user.id });
  res.json(userData.cartData);
};
export { addToCart, removeFromCart, getCartData };

import mongoose from "mongoose";
import moment from "moment-timezone";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: () => moment().tz("Asia/Ho_Chi_Minh").format(),
  },
});
const User = mongoose.model("User", userSchema);
export default User;

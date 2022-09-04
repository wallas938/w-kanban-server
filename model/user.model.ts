import mongoose, { Schema } from "mongoose";
const UserModel = mongoose.model(
  "User",
  new Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
);

export default UserModel;

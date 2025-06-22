import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    assitantName: {
      type: String,
    },
    assistantImage: {
      type: String,
    },
    history: [{ type: String }],
  },
  { timeStamp: true }
);

const User = mongoose.model("User", userSchema);
export default User;

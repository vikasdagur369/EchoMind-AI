import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getCurrentUser,
  updateAssistant,
} from "../controllers/user.controllers.js";
import multer from "multer";

const upload = multer();
const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update", isAuth, upload.none(), updateAssistant);

export default userRouter;

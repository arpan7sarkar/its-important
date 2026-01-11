import express from "express";
import {
  signInController,
  signUpController,
} from "../controller/signInController.js";

const userRouter = express.Router();

userRouter.post("/signup", signUpController);
userRouter.post("/signin", signInController);

export default userRouter;

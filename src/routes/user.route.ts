import express from "express";
import {
  signInController,
  singUpController,
} from "../controller/signInController.js";

const userRouter = express.Router();

userRouter.post("/signup", singUpController);
userRouter.post("/signin", signInController);

export default userRouter;

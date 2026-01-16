import express from "express";
import { isVerifiedMiddleware } from "../middleware/isVerified.js";
import { createContentController } from "../controller/createContentController.js";

const contentRouter= express.Router();


contentRouter.post("/create",isVerifiedMiddleware,createContentController)

export default contentRouter;
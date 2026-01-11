import mongoose, { type ObjectId } from "mongoose";
import { UserModel } from "./UserModel.js";

const contentTypes = ["image", "video", "article", "audio", "shorts", "others"];

const { ObjectId } = mongoose.Schema.Types;

const ContentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: ObjectId, ref: "Tag" }],
  userId: { type: ObjectId, ref: "User", required: true },
   validate: async (value: ObjectId)=> {
      const user = await UserModel.findById(value);
      if (!user) {
        throw new Error('User does not exist');
      }
    }
});

const LinkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: { type: ObjectId, ref: "User", required: true },
  validate: async (value: ObjectId)=> {
      const user = await UserModel.findById(value);
      if (!user) {
        throw new Error('User does not exist');
      }
    }
});

export const Content = mongoose.model("Content", ContentSchema);
export const Link = mongoose.model("Link", LinkSchema);


import {Schema,Model} from "mongoose";


const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel=new Model( "User", UserSchema);



import { UserModel } from "../model/UserModel.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel; 
    }
  }
}
export {}

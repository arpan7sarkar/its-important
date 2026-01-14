import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { UserModel } from "../model/UserModel.js";
export const isVerifiedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const header = req.headers["authorization"];
  if (!header) return res.json({ message: "Please login again" });
  try {
    const decode = (await jwt.verify(
      header as string,
      process.env.JWT_SECRET as string
    )) as DecodedToken;

    const user = await UserModel.findById(decode._id);
    if (!user || !decode)
      return res
        .status(403)
        .json({ message: "Something went wrong please login again" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Something went wrong" });
  }
};

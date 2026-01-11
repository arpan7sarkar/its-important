import { type Request, type Response } from "express";
import { z } from "zod";
import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const singUpController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requestBody = z.object({
      username: z.string().min(3).max(15),
      email: z.string().email().min(5).max(30),
      password: z
        .string()
        .min(8)
        .max(50)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,50}$/
        ),
    });

    const { success, error, data } = requestBody.safeParse(req.body);
    if (!success) {
      return res
        .status(411)
        .json({ message: "Error with inputs", error: error.format() });
    }
    const { username, email, password } = data;
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(403).json({ message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({ message: "User succesfully created" });
  } catch (err) {
    return res.status(400).json({ message: "Server error", err });
  }
};

export const signInController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requestBody = z.object({
      identifier: z.union([
        z.string().email().min(5).max(30), // Email check
        z.string().min(3).max(15), // Username check
      ]),
      password: z
        .string()
        .min(8)
        .max(50)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,50}$/
        ),
    });

    const { success, error, data } = requestBody.safeParse(req.body);
    if (!success)
      return res
        .status(411)
        .json({ message: "Error is occuring ", error: error.format() });

    const { identifier, password } = data;
    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(403).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "User login succesfully ", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

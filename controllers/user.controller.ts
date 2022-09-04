import { AES, HmacSHA1, HmacSHA256, SHA256 } from "crypto-js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import UserModel from "../model/user.model";

const signup = async (req: Request, res: Response) => {
  if (!req.body.email.trim() || !req.body.password.trim())
    return res.status(400).json({
      message: "Email/Password is empty",
    });

  const email = req.body.email;
  const password = req.body.password;

  try {
    const isEmailExists = await checkIfEmailExists(email);

    if (isEmailExists) {
      return res.status(400).json({
        message: "This email is already used",
      });
    }

    const encryptedPassword = AES.encrypt(
      password,
      `${process.env.SECRET_KEY}`
    ).toString();

    const user = new UserModel({
      email: email,
      password: encryptedPassword,
    });

    const registeredUser = (await user.save()).depopulate("password");

    return res.status(201).json({
      user: { email: registeredUser.email, _id: registeredUser._id },
    });
  } catch (error) {
    return res.status(500).json({
      errorCode: 500,
      message: "An error occured",
    });
  }
};

const checkIfEmailExists = async (email: string) => {
  try {
    const res = await UserModel.findOne({ email: email });

    if (res) return true;

    return false;
  } catch (error) {
    return false;
  }
};

export default {
  signup,
};

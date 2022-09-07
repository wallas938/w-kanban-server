import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import { AES } from "crypto-js";
import jwt from "jsonwebtoken";
import UserModel from "../model/user.model";

const signup = async (req: Request, res: Response) => {
  if (!req.body.email.trim() || !req.body.password.trim())
    return res.status(400).json({
      message: "Email/Password is empty",
      statusCode: 400,
      ok: false,
    });

  const email = req.body.email;
  const password = req.body.password;

  try {
    const isEmailExists = await checkIfEmailExists(email);

    if (isEmailExists) {
      return res.status(400).json({
        message: "This email is already used",
        statusCode: 400,
        ok: false,
      });
    }

    const encryptedPassword = AES.encrypt(
      password,
      `${process.env.PASSWORD_SECRET_KEY}`
    ).toString();

    const user = new UserModel({
      email: email,
      password: encryptedPassword,
    });

    const registeredUser = await user.save();
    const payload = {
      _id: registeredUser._id,
      email: registeredUser.email,
    };

    const access_token = generateAccessToken(payload);
    const refresh_token = generateRefreshToken(payload);
    return res.status(201).json({
      email: registeredUser.email,
      statusCode: 201,
      _id: registeredUser._id,
      ok: true,
      access_token,
      refresh_token,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      ok: false,
      message: "An error occured",
    });
  }
};

const signin = async (req: Request, res: Response) => {
  if (!req.body.email.trim() || !req.body.password.trim())
    return res.status(400).json({
      message: "Email/Password is empty",
    });

  const email = req.body.email;
  const password = req.body.password;

  const isUserExists = await checkIfEmailExists(email);
  if (!isUserExists)
    return res.status(401).json({
      message: "Email/Password is wrong",
    });

  const user = await UserModel.findOne({ email: email });

  if (user) {
    const bytes = AES.decrypt(
      user?.password,
      `${process.env.PASSWORD_SECRET_KEY}`
    );
    const userPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (userPassword !== password)
      return res.status(401).json({
        message: "Email/Password is wrong",
      });

    const payload = {
      _id: user._id,
      email: user.email,
    };

    const access_token = generateAccessToken(payload);
    const refresh_token = generateRefreshToken(payload);

    return res.status(200).json({
      email: user.email,
      statusCode: 201,
      _id: user._id,
      ok: true,
      access_token,
      refresh_token,
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

const generateAccessToken = (payload: any): string => {
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET_KEY}`, {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
  });
};

const generateRefreshToken = (payload: any): string => {
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET_KEY}`, {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 3600,
  });
};

const verifyTokenValidity = (token: string): boolean => {
  /* Verifier la validité du token ( et   en verifiant cette sont refresh token) */

  /* - forme et expiration
    - si exp dépassé on verifie qu'il existe en tant qu'utilisateur avant de mettre son token a jour
    - s'il existe mettre a jour avec refresh token sauf si exp aussi alors renvoyer vers la page d'authentification */
  try {
    const tokenVerified = jwt.verify(
      "false token",
      `${process.env.ACCESS_TOKEN_SECRET_KEY}`
    );

    return true;
  } catch (error) {
    return false;
  }
};

export default {
  signup,
  signin,
};

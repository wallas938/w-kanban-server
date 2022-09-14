import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import { AES } from "crypto-js";
import jwt from "jsonwebtoken";
import UserModel from "../model/user.model";
import { isTokenValid } from "~/utils/token.func";

const signup = async (req: Request, res: Response) => {
  if (!req.body.email.trim() || !req.body.password.trim())
    return res.status(400).json({
      message: "Email/Password is empty",
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

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return res.status(201).json({
      user: {
        email: registeredUser.email,
      _id: registeredUser._id,
      accessToken,
      refreshToken,
      },
      ok: true,
    });
  } catch (error) {
    return res.status(500).json({
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
  try {
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

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      return res.status(200).json({
        user: {
          email: user.email,
        _id: user._id,
        accessToken,
        refreshToken,
      },
      ok: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      ok: false,
      message: "An error occured",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  const accessToken: any =  req.query.access_token;
  const refreshToken =  req.query.refresh_token;

  if(isTokenValid(accessToken, `${process.env.ACCESS_TOKEN_SECRET_KEY}`)) {
    const userData: any = jwt.decode(accessToken.split(" ")[1])
    
    const user = await UserModel.findById(userData._id).select('-password')

    if(user) {

      return res.status(200).json({
        user: {
          email: user.email,
          _id: user._id,
          accessToken,
          refreshToken,
        },
        ok: true,
      })
    }
    
  }
}

const autoLogin = async (req: Request, res: Response) => {};

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
  var oneDayInMilliseconds = 1 * 24 * 60 * 60 * 1000;
  return "Bearer " + jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET_KEY}`, {
    expiresIn: Date.now() + oneDayInMilliseconds,
  });
};

const generateRefreshToken = (payload: any): string => {
  var weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  return "Bearer " + jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET_KEY}`, {
    expiresIn: Date.now() + weekInMilliseconds,
  });
};

export default {
  signup,
  signin,
  getUser
};

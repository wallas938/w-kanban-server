import { Response, Request } from "express";
import jwt from "jsonwebtoken";
const acc_tkn = (req: any, res: Response, next: any) => {
  const access_token = req.get("Authorization");
  if (access_token) {
    const token = access_token.split(" ")[1];
    if (isTokenValid(token)) {
      req.isTokenValid = true;
    } else {
      req.isTokenValid = false;
    }
  }
  next();
};

const rfsh_tkn = (req: any, res: Response, next: any) => {
  if (req.isTokenValid) {
    next();
  } else {
    const refresh_token = req.get("rf_t").split(" ")[1];
    if (isTokenValid(refresh_token)) {
      next();
    } else {
      return res.status(401).json({
        message: "Invalid token",
        ok: false,
      });
    }
  }
};

const isTokenValid = (token: string): boolean => {
  try {
    const decodesToken: any = jwt.decode(token);
    const tokenVerified = jwt.verify(
      token,
      `${process.env.ACCESS_TOKEN_SECRET_KEY}`
    );

    if (new Date(Date.now()) > new Date(decodesToken.exp)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export default {
  acc_tkn,
  rfsh_tkn,
};

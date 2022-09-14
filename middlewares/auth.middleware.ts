import { Response, Request } from "express";
import { isTokenValid } from "~/utils/token.func";
const acc_tkn = (req: any, res: Response, next: any) => {
  const accessToken = req.get("Authorization");
  if (accessToken) {
    const token = accessToken;
    if (isTokenValid(token, `${process.env.ACCESS_TOKEN_SECRET_KEY}`)) {
      req.isAccessTokenValid = true;
    } else {
      req.isAccessTokenValid = false;
    }
  }
  next();
};

const rfsh_tkn = (req: any, res: Response, next: any) => {
  if (req.isAccessTokenValid) {
    next();
  } else {
    const refreshToken = req.get("rf_t");
    if (isTokenValid(refreshToken, `${process.env.REFRESH_TOKEN_SECRET_KEY}`)) {
      next();
    } else {
      return res.status(401).json({
        message: "Invalid token",
        ok: false,
      });
    }
  }
};

export default {
  acc_tkn,
  rfsh_tkn,
};

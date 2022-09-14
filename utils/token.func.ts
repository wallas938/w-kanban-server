import jwt from "jsonwebtoken";


export const isTokenValid = (token: string, secret: string): boolean => {
    try {
        const tokenSplited = token.split(" ")[1];
        const decodedToken: any = jwt.decode(tokenSplited);
        jwt.verify(
            tokenSplited,
            `${secret}`
          );

      if (new Date(Date.now()) > new Date(decodedToken.exp)) {
        return false;
      }
      
      return true;
    } catch (error) {
        console.log(error);

      return false;
    }
  };


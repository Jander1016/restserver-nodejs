import { NextFunction, Response, Request } from "express";
import { JwtAdapter } from "../../config/jwt";
import { UserModel } from "../../data/mongodb";

export class AuthMiddleware {
  static validateJwt = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.header("Authorization");
    if (!authorization)
      return res.status(401).json({ error: "No token Provider" });
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Invalid Bearer Token" });

    const token = authorization.split(" ").at(1) || "";

    try {

      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid Token" });

      const user = await UserModel.findById(payload.id);
      if (!user) return res.status(401).json({ error: "Invalid Token - User not found" });

      req.body.user = user;


      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error Middelware" });
    }
  };
}

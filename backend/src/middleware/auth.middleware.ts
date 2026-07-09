import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header =
    req.headers.authorization;

  if (!header) {
    return res
      .status(401)
      .json({
        message:
          "Token required"
      });
  }

  const token =
    header.replace(
      "Bearer ",
      ""
    );

  try {
    const payload =
      jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );

    (req as any).user =
      payload;

    next();
  } catch {
    return res
      .status(401)
      .json({
        message:
          "Invalid token"
      });
  }
}
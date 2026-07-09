import { Request, Response } from "express";
import { login } from "../services/auth.service";

export async function loginUser(
  req: Request,
  res: Response
) {
  try {
    const result = await login(
      req.body.email,
      req.body.password
    );

    res.json(result);
  } catch {
    res.status(401).json({
      message: "Invalid credentials"
    });
  }
}
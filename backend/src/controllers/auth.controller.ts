import { Request, Response } from "express";
import { login } from "../services/auth.service";

export async function loginUser(
  req: Request,
  res: Response
) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const result = await login(email, password);
    return res.json(result);
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }
}
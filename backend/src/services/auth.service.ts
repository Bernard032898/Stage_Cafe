import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export async function login(
  email: string,
  password: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email
      },
      include: {
        role: true
      }
    });

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const valid =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!valid) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role.name
    },
    jwtSecret,
    {
      expiresIn: "1d"
    }
  );

  const { passwordHash, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword
  };
}
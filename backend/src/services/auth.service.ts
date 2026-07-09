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

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role.name
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d"
    }
  );

  return {
    token,
    user
  };
}
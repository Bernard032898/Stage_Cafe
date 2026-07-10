import bcrypt from "bcrypt";
import { prisma } from "../prisma";

export function getUsers() {
  return prisma.user.findMany({
    include: {
      role: true,
    },
  });
}

export async function createUser(body: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const role = await prisma.role.findUnique({
    where: { id: body.roleId },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  return prisma.user.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      passwordHash,
      roleId: body.roleId,
      isActive: true,
    },
    include: {
      role: true,
    },
  });
}

export async function updateUser(
  id: string,
  body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roleId?: string;
    isActive?: boolean;
  }
) {
  const data: any = {};

  if (body.firstName !== undefined) {
    data.firstName = body.firstName;
  }

  if (body.lastName !== undefined) {
    data.lastName = body.lastName;
  }

  if (body.email !== undefined) {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser && existingUser.id !== id) {
      throw new Error("Email already in use");
    }

    data.email = body.email;
  }

  if (body.password !== undefined) {
    data.passwordHash = await bcrypt.hash(body.password, 10);
  }

  if (body.roleId !== undefined) {
    const role = await prisma.role.findUnique({
      where: { id: body.roleId },
    });

    if (!role) {
      throw new Error("Role not found");
    }

    data.roleId = body.roleId;
  }

  if (body.isActive !== undefined) {
    data.isActive = body.isActive;
  }

  return prisma.user.update({
    where: { id },
    data,
    include: {
      role: true,
    },
  });
}

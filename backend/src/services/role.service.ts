import { prisma } from "../prisma";

export function getRoles() {
  return prisma.role.findMany();
}

export async function createRole(name: string) {
  const existingRole = await prisma.role.findUnique({
    where: { name },
  });

  if (existingRole) {
    throw new Error("Role already exists");
  }

  return prisma.role.create({
    data: { name },
  });
}

export async function updateRole(id: string, name: string) {
  const existingRole = await prisma.role.findUnique({
    where: { name },
  });

  if (existingRole && existingRole.id !== id) {
    throw new Error("Role name already in use");
  }

  return prisma.role.update({
    where: { id },
    data: { name },
  });
}

import { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getUsers();
  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  const {
    firstName,
    lastName,
    email,
    password,
    roleId,
  } = req.body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roleId?: string;
  };

  if (!firstName || !lastName || !email || !password || !roleId) {
    return res.status(400).json({
      message: "firstName, lastName, email, password, and roleId are required",
    });
  }

  try {
    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      password,
      roleId,
    });

    return res.status(201).json(user);
  } catch (error: any) {
    console.error("Create user failed:", error);
    return res.status(400).json({
      message: error?.message || "Unable to create user",
    });
  }
}

export async function updateUser(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const {
    firstName,
    lastName,
    email,
    password,
    roleId,
    isActive,
  } = req.body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roleId?: string;
    isActive?: boolean;
  };

  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }

  try {
    const user = await userService.updateUser(id, {
      firstName,
      lastName,
      email,
      password,
      roleId,
      isActive,
    });

    return res.json(user);
  } catch (error: any) {
    console.error("Update user failed:", error);
    return res.status(400).json({
      message: error?.message || "Unable to update user",
    });
  }
}

export async function updateUserStatus(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawIsActive = Array.isArray(req.body?.isActive)
    ? req.body.isActive[0]
    : req.body?.isActive;
  const isActive = typeof rawIsActive === "boolean" ? rawIsActive : undefined;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      message: "isActive must be a boolean",
    });
  }

  try {
    const user = await userService.updateUser(id, { isActive });
    return res.json(user);
  } catch (error: any) {
    console.error("Update user status failed:", error);
    return res.status(400).json({
      message: error?.message || "Unable to update user status",
    });
  }
}

import { Request, Response } from "express";
import * as roleService from "../services/role.service";

export async function getRoles(req: Request, res: Response) {
  const roles = await roleService.getRoles();
  res.json(roles);
}

export async function createRole(req: Request, res: Response) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  try {
    const role = await roleService.createRole(name);
    return res.status(201).json(role);
  } catch (error: any) {
    console.error("Create role failed:", error);
    return res.status(400).json({
      message: error?.message || "Unable to create role",
    });
  }
}

export async function updateRole(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { name } = req.body as { name?: string };

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  try {
    const role = await roleService.updateRole(id, name);
    return res.json(role);
  } catch (error: any) {
    console.error("Update role failed:", error);
    return res.status(400).json({
      message: error?.message || "Unable to update role",
    });
  }
}

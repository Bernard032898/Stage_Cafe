import { Request, Response } from "express";
import * as tableService from "../services/table.service";

export async function getAllTables(req: Request, res: Response) {
  try {
    const tables = await tableService.getAllTables();
    res.json(tables);
  } catch (err: any) {
    console.error("Get tables failed:", err);
    res.status(400).json({ message: err?.message || "Unable to get tables" });
  }
}

export async function createTable(req: Request, res: Response) {
  try {
    const table = await tableService.createTable();
    res.status(201).json(table);
  } catch (err: any) {
    console.error("Create table failed:", err);
    res.status(400).json({ message: err?.message || "Unable to create table" });
  }
}

export async function deleteTable(req: Request, res: Response) {
  const idValue = req.params.id;
  const id = Array.isArray(idValue) ? idValue[0] : idValue;

  if (!id) {
    return res.status(400).json({ message: "Table id is required" });
  }

  try {
    await tableService.deleteTable(id);
    res.json({ message: "Table deleted successfully" });
  } catch (err: any) {
    console.error("Delete table failed:", err);
    res.status(400).json({ message: err?.message || "Unable to delete table" });
  }
}

export async function updateTableStatus(req: Request, res: Response) {
  const idValue = req.params.id;
  const id = Array.isArray(idValue) ? idValue[0] : idValue;
  const { isInUse } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Table id is required" });
  }

  if (typeof isInUse !== "boolean") {
    return res.status(400).json({ message: "isInUse must be a boolean" });
  }

  try {
    const table = await tableService.updateTableStatus(id, isInUse);
    res.json(table);
  } catch (err: any) {
    console.error("Update table status failed:", err);
    res.status(400).json({ message: err?.message || "Unable to update table status" });
  }
}

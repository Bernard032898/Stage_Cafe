import { Request, Response } from "express";
import * as orderService from "../services/order.service";

export async function getAllOrders(
  req: Request,
  res: Response
) {
  const orders =
    await orderService.getOrders();

  res.json(orders);
}

export async function createOrder(
  req: Request,
  res: Response
) {
  const userId = (req as any).user?.userId;
  const body = req.body;

  if (!userId) {
    return res.status(401).json({
      message: "User authentication required"
    });
  }

  if (!body.tableId && body.tableNumber == null) {
    return res.status(400).json({
      message: "tableId or tableNumber is required"
    });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({
      message: "items is required and must be a non-empty array"
    });
  }

  try {
    const order =
      await orderService.createOrder({
        userId,
        tableId: body.tableId,
        tableNumber: body.tableNumber,
        items: body.items
      });

    return res.status(201).json(order);
  } catch (error: any) {
    console.error("Create order failed:", error);
    return res.status(400).json({
      message: error?.message || "Unable to create order"
    });
  }
}

export async function createMultipleOrders(
  req: Request,
  res: Response
) {
  const userId = (req as any).user?.userId;
  const body = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User authentication required" });
  }

  if (!Array.isArray(body.orders) || body.orders.length === 0) {
    return res.status(400).json({ message: "orders is required and must be a non-empty array" });
  }

  try {
    const orders = await orderService.createMultipleOrders({ userId, orders: body.orders });
    return res.status(201).json(orders);
  } catch (error: any) {
    console.error("Create multiple orders failed:", error);
    return res.status(400).json({ message: error?.message || "Unable to create orders" });
  }
}

export async function completeOrder(req: Request, res: Response) {
  const idValue = req.params.id;
  const id = Array.isArray(idValue) ? idValue[0] : idValue;
  if (!id) return res.status(400).json({ message: "Order id required" });

  try {
    const order = await orderService.markOrderComplete(id);
    return res.json(order);
  } catch (err: any) {
    console.error("Complete order failed:", err);
    return res.status(400).json({ message: err?.message || "Unable to complete order" });
  }
}

export async function getTables(req: Request, res: Response) {
  try {
    const tables = await orderService.getCafeTables();
    return res.json(tables);
  } catch (err: any) {
    console.error("Get tables failed:", err);
    return res.status(400).json({ message: err?.message || "Unable to get tables" });
  }
}

export async function getIncome(req: Request, res: Response) {
  const periodValue = req.query.period;
  let period = "day";

  if (typeof periodValue === "string") {
    period = periodValue;
  } else if (Array.isArray(periodValue) && typeof periodValue[0] === "string") {
    period = periodValue[0];
  }

  if (!["day", "month", "year"].includes(period)) {
    return res.status(400).json({ message: "Invalid period, expected day|month|year" });
  }

  try {
    const stats = await orderService.getIncome(period as "day" | "month" | "year");
    return res.json(stats);
  } catch (err: any) {
    console.error("Get income failed:", err);
    return res.status(400).json({ message: err?.message || "Unable to get income" });
  }
}

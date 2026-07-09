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

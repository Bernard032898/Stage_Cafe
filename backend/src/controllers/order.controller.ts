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
  const order =
    await orderService.createOrder(
      req.body
    );

  res.status(201).json(order);
}
import { Request, Response } from "express";
import * as productService from "../services/product.service";

export async function getAllProducts(
  req: Request,
  res: Response
) {
  const products =
    await productService.getProducts();

  res.json(products);
}

export async function createProduct(
  req: Request,
  res: Response
) {
  const product =
    await productService.createProduct(
      req.body
    );

  res.status(201).json(product);
}
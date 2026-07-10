import { Request, Response } from "express";
import * as productService from "../services/product.service";

export async function getAllProducts(req: Request, res: Response) {
  const products = await productService.getProducts();
  res.json(products);
}

export async function getAllCategories(req: Request, res: Response) {
  const categories = await productService.getCategories();
  res.json(categories);
}

export async function createProduct(req: Request, res: Response) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || "Unable to create product" });
  }
}
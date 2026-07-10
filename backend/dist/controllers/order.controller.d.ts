import { Request, Response } from "express";
export declare function getAllOrders(req: Request, res: Response): Promise<void>;
export declare function createOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createMultipleOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function completeOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function cancelOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getTables(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getIncome(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getTopProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=order.controller.d.ts.map
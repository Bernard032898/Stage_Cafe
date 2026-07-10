import { Request, Response } from "express";
export declare function getAllTables(req: Request, res: Response): Promise<void>;
export declare function createTable(req: Request, res: Response): Promise<void>;
export declare function deleteTable(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateTableStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=table.controller.d.ts.map
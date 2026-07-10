export declare function getAllTables(): import(".prisma/client").Prisma.PrismaPromise<({
    orders: {
        id: string;
        createdAt: Date;
        userId: string;
        orderNumber: string;
        tableId: string;
        total: import("@prisma/client-runtime-utils").Decimal;
        isCompleted: boolean;
        isCancelled: boolean;
    }[];
} & {
    id: string;
    tableNumber: number;
})[]>;
export declare function createTable(): Promise<{
    id: string;
    tableNumber: number;
}>;
export declare function deleteTable(id: string): Promise<{
    id: string;
    tableNumber: number;
}>;
export declare function updateTableStatus(id: string, isInUse: boolean): Promise<{
    orders: {
        id: string;
        createdAt: Date;
        userId: string;
        orderNumber: string;
        tableId: string;
        total: import("@prisma/client-runtime-utils").Decimal;
        isCompleted: boolean;
        isCancelled: boolean;
    }[];
} & {
    id: string;
    tableNumber: number;
}>;
//# sourceMappingURL=table.service.d.ts.map
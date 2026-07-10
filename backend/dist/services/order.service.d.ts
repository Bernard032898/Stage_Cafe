export declare function getOrders(): import(".prisma/client").Prisma.PrismaPromise<({
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        isActive: boolean;
        roleId: string;
        createdAt: Date;
    };
    table: {
        id: string;
        tableNumber: number;
    };
    items: ({
        product: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            categoryId: string;
        };
    } & {
        id: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        productId: string;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    userId: string;
    orderNumber: string;
    tableId: string;
    total: import("@prisma/client-runtime-utils").Decimal;
    isCompleted: boolean;
    isCancelled: boolean;
})[]>;
export declare function getCafeTables(): import(".prisma/client").Prisma.PrismaPromise<{
    id: string;
    tableNumber: number;
}[]>;
export declare function createOrder(body: any): Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        isActive: boolean;
        roleId: string;
        createdAt: Date;
    };
    table: {
        id: string;
        tableNumber: number;
    };
    items: ({
        product: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            categoryId: string;
        };
    } & {
        id: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        productId: string;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    userId: string;
    orderNumber: string;
    tableId: string;
    total: import("@prisma/client-runtime-utils").Decimal;
    isCompleted: boolean;
    isCancelled: boolean;
}>;
export declare function createMultipleOrders(body: any): Promise<any[]>;
export declare function markOrderComplete(orderId: string): Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        isActive: boolean;
        roleId: string;
        createdAt: Date;
    };
    table: {
        id: string;
        tableNumber: number;
    };
    items: ({
        product: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            categoryId: string;
        };
    } & {
        id: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        productId: string;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    userId: string;
    orderNumber: string;
    tableId: string;
    total: import("@prisma/client-runtime-utils").Decimal;
    isCompleted: boolean;
    isCancelled: boolean;
}>;
export declare function cancelOrder(orderId: string): Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        isActive: boolean;
        roleId: string;
        createdAt: Date;
    };
    table: {
        id: string;
        tableNumber: number;
    };
    items: ({
        product: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            categoryId: string;
        };
    } & {
        id: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        productId: string;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    userId: string;
    orderNumber: string;
    tableId: string;
    total: import("@prisma/client-runtime-utils").Decimal;
    isCompleted: boolean;
    isCancelled: boolean;
}>;
export declare function getIncome(period: "day" | "month" | "year"): Promise<{
    period: "year" | "day" | "month";
    total: number;
}>;
export declare function getTopProducts(period: "day" | "month" | "year"): Promise<{
    productId: string;
    name: string;
    quantity: number;
}[]>;
//# sourceMappingURL=order.service.d.ts.map
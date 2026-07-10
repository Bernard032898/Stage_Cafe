export declare function getProducts(): import(".prisma/client").Prisma.PrismaPromise<({
    category: {
        id: string;
        name: string;
    };
} & {
    id: string;
    name: string;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    categoryId: string;
})[]>;
export declare function getCategories(): import(".prisma/client").Prisma.PrismaPromise<{
    id: string;
    name: string;
}[]>;
export declare function createProduct(data: any): Promise<{
    category: {
        id: string;
        name: string;
    };
} & {
    id: string;
    name: string;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    categoryId: string;
}>;
//# sourceMappingURL=product.service.d.ts.map
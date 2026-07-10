export declare function getRoles(): import(".prisma/client").Prisma.PrismaPromise<{
    id: string;
    name: string;
}[]>;
export declare function createRole(name: string): Promise<{
    id: string;
    name: string;
}>;
export declare function updateRole(id: string, name: string): Promise<{
    id: string;
    name: string;
}>;
//# sourceMappingURL=role.service.d.ts.map
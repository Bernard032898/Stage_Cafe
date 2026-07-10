export declare function getUsers(): import(".prisma/client").Prisma.PrismaPromise<({
    role: {
        id: string;
        name: string;
    };
} & {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    isActive: boolean;
    roleId: string;
    createdAt: Date;
})[]>;
export declare function createUser(body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: string;
}): Promise<{
    role: {
        id: string;
        name: string;
    };
} & {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    isActive: boolean;
    roleId: string;
    createdAt: Date;
}>;
export declare function updateUser(id: string, body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roleId?: string;
    isActive?: boolean;
}): Promise<{
    role: {
        id: string;
        name: string;
    };
} & {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    isActive: boolean;
    roleId: string;
    createdAt: Date;
}>;
//# sourceMappingURL=user.service.d.ts.map
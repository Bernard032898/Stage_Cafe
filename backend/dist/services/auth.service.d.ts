export declare function login(email: string, password: string): Promise<{
    token: string;
    user: {
        role: {
            id: string;
            name: string;
        };
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        roleId: string;
        createdAt: Date;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map
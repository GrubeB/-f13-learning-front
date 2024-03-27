export class AuthenticationContext {
    user!: {
        id?: string;
        email?: string;
        name?: string;
    };
    authorities!: {
        roles?: string[];
        privilages?: string[];
    };
    tokens!: {
        accessToken?: string;
    }
}

export class AuthResponse {
    accessToken!: string;
    tokenType!: string;
    expiresIn!: string;
}


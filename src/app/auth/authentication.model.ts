import { User } from "../component/user/user.model";

export class AuthenticationContext {
    user!: {
        id?: string;
        email?: string;
        name?: string;
        avatarId?: string;
    };
    authorities!: {
        roles?: string[];
        privilages?: string[];
    };
    tokens!: {
        accessToken?: string;
    };
    userModel?: User;
}

export class AuthResponse {
    accessToken!: string;
    tokenType!: string;
    expiresIn!: string;
}


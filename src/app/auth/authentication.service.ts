import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Observable, ReplaySubject, Subject, filter, first, lastValueFrom, map, shareReplay, take, tap } from 'rxjs';
import { AuthResponse, AuthenticationContext } from './authentication.model';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { NGXLogger } from 'ngx-logger';
import { UserQueryService } from '../component/user/user-query.service';

@Injectable()
export class AuthenticationService {
    http = inject(HttpClient);
    logger = inject(NGXLogger);
    userQueryService = inject(UserQueryService);

    resourceName: string = "auth";
    resourcePath: string = "/api/v1/" + this.resourceName;
    url: string = "http://localhost:9007" + this.resourcePath;

    private _authenticationContext = new ReplaySubject<AuthenticationContext | null>(1);

    constructor() {
        this._authenticationContext.next(null);
    }

    authenticationContext$(): Observable<AuthenticationContext | null> {
        return this._authenticationContext;
    }

    isAuthenticated$(): Observable<boolean> {
        return this._authenticationContext.pipe(
            map(context => !!context)
        );
    }

    accessToken$(): Observable<string | null> {
        return this._authenticationContext.pipe(
            map(context => context?.tokens?.accessToken ?? null)
        );
    }
    userId$(): Observable<string | null> {
        return this._authenticationContext.pipe(
            map(context => context?.user?.id ?? null),
            shareReplay(1)
        );
    }
    login(email: string, password: string) {
        this.logger.debug(AuthenticationService.name, " login()");
        return this.http.post<AuthResponse>(this.url + '/authenticate', { email, password })
            .pipe(map(response => {
                this.logger.debug(AuthenticationService.name, " accessToken: ", response.accessToken);
                let decodedToken: any = jwtDecode<JwtPayload>(response.accessToken);

                let context: AuthenticationContext = {
                    user: {
                        id: decodedToken.user_id,
                        email: decodedToken.sub,
                        name: decodedToken.sub,
                    },
                    authorities: {
                        roles: [],
                        privilages: decodedToken.auth.split(','),
                    },
                    tokens: {
                        accessToken: response.accessToken
                    }
                };
                this.logger.debug(AuthenticationService.name, " new authenticationContext ", context);
                this._authenticationContext.next(context);


                this.userQueryService.get(decodedToken.user_id).pipe(first()).subscribe({
                    next: data => {
                        let context: AuthenticationContext = {
                            user: {
                                id: data.id,
                                email: data.email,
                                name: data.username,
                                avatarId: data.avatarFileId,
                            },
                            authorities: {
                                roles: data.roles,
                                privilages: data.permissions,
                            },
                            tokens: {
                                accessToken: response.accessToken
                            },
                            userModel: data,
                        };
                        this.logger.debug(AuthenticationService.name, " new authenticationContext ", context);
                        this._authenticationContext.next(context);
                    }
                });
            }));
    }

    logout(): void {
        this.logger.debug(AuthenticationService.name, " logout()");
    }
}

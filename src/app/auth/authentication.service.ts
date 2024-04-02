import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Observable, ReplaySubject, Subject, filter, first, map, shareReplay, tap } from 'rxjs';
import { AuthResponse, AuthenticationContext } from './authentication.model';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class AuthenticationService {
    http = inject(HttpClient);
    logger = inject(NGXLogger);

    resourceName: string = "auth";
    resourcePath: string = "/api/v1/" + this.resourceName;
    url: string = "http://localhost:9007" + this.resourcePath;

    private authenticationContext = new ReplaySubject<AuthenticationContext | null>(1);

    constructor() {
        this.authenticationContext.next(null);
    }

    authenticationContext$(): Observable<AuthenticationContext | null> {
        return this.authenticationContext;
    }
    isAuthenticated$(): Observable<boolean> {
        return this.authenticationContext.pipe(
            map(context => !!context)
        );
    }

    accessToken$(): Observable<string | null> {
        return this.authenticationContext.pipe(
            map(context => context?.tokens?.accessToken ?? null)
        );
    }

    login(email: string, password: string) {
        this.logger.debug(AuthenticationService.name, " login()");
        return this.http.post<AuthResponse>(this.url + '/authenticate', { email, password })
            .pipe(map(response => {
                this.logger.debug(AuthenticationService.name, " accessToken: ", response.accessToken);
                let decodedToken: any = jwtDecode<JwtPayload>(response.accessToken);

                // TODO get decoded values
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
                this.authenticationContext.next(context);
            }))
    }

    logout(): void {
        this.logger.debug(AuthenticationService.name, " logout()");
    }
}

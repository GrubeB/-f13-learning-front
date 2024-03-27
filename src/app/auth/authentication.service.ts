import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, filter, map, shareReplay, tap } from 'rxjs';
import { AuthResponse, AuthenticationContext } from './authentication.model';
import { jwtDecode } from 'jwt-decode';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class AuthenticationService {

    resourceName: string = "auth";
    resourcePath: string = "/api/v1/" + this.resourceName;
    url: string = "http://localhost:9007" + this.resourcePath;

    constructor(
        private http: HttpClient,
        private logger: NGXLogger
    ) {
        this.authenticationContext.next(null);
    }

    private authenticationContext = new ReplaySubject<AuthenticationContext | null>(1);
    
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
        return this.http.post<AuthResponse>(this.url + '/authenticate', { email, password })
            .pipe(map(response => {
                let decodedToken = jwtDecode(response.accessToken);
                // TODO get decoded values
                let context: AuthenticationContext = {
                    user: {
                        id: "displayname",
                        email: "email",
                        name: "name"
                    },
                    authorities: {
                        roles: [],
                        privilages: []
                    },
                    tokens: {
                        accessToken: response.accessToken
                    }
                };
                this.logger.debug("new authenticationContext ", context);
                this.authenticationContext.next(context);
            }))
    }

    logout(): void {

    }
}

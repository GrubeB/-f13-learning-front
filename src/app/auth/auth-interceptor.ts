import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

import { Observable, map, switchMap, tap } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { NGXLogger } from 'ngx-logger';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthenticationService, 
        private logger: NGXLogger
    ) {
        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.logger.info("intercepting request");
        return this.authService.accessToken$().pipe(
            switchMap(token => {
                if (token != null) {
                    req = req.clone({
                        url: req.url,
                        setHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    this.logger.info("added token to request");
                }
                return next.handle(req);
            })
        );
    }
}
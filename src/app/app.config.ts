import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from './service/local-storage.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthenticationService } from './auth/authentication.service';
import { CategoryService } from './service/category.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      // serverLogLevel: NgxLoggerLevel.ERROR
    })),
    { provide: AuthenticationService },
    { provide: LocalStorageService },
    { provide: CategoryService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ]
};

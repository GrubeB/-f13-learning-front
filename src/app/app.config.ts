import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from './service/local-storage.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthenticationService } from './auth/authentication.service';
import { CategoryService } from './service/category.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { EventBusService } from './service/event-bus.service';
import { TopicService } from './service/topic.service';
import { TopicReferenceService } from './service/topic-reference.service';
import { ReferenceQueryService } from './service/reference-query.service';
import { ReferenceVotingService } from './service/reference-voting.service';
import { TopicQueryService } from './service/topic-query.service';
import { CategoryQueryService } from './service/category-query.service';

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
    { provide: EventBusService},

    { provide: CategoryService },
    { provide: CategoryQueryService },

    { provide: TopicService},
    { provide: TopicQueryService},

    { provide: TopicReferenceService},
    { provide: ReferenceQueryService},
    { provide: ReferenceVotingService},

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ]
};

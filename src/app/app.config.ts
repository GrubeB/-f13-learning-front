import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from './service/local-storage.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthenticationService } from './auth/authentication.service';
import { CategoryService } from './component/category/category.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { EventBusService } from './service/event-bus.service';
import { TopicService } from './component/topic/topic.service';
import { TopicReferenceService } from './component/topic/topic-reference.service';
import { ReferenceQueryService } from './component/reference/reference-query.service';
import { ReferenceVotingService } from './component/reference/reference-voting.service';
import { TopicQueryService } from './component/topic/topic-query.service';
import { CategoryQueryService } from './component/category/category-query.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(HttpClientModule),

    importProvidersFrom(LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      colorScheme: ['purple', 'teal', 'orange', 'gray', 'red', 'red', 'red']
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

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from './shared/service/local-storage.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthenticationService } from './auth/authentication.service';
import { CategoryService } from './component/category/category.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { EventBusService } from './shared/service/event-bus.service';
import { TopicService } from './component/topic/topic.service';
import { TopicReferenceService } from './component/reference/topic-reference.service';
import { ReferenceQueryService } from './component/reference/reference-query.service';
import { ReferenceVotingService } from './component/voting/reference-voting.service';
import { TopicQueryService } from './component/topic/topic-query.service';
import { CategoryQueryService } from './component/category/category-query.service';
import { CommentQueryService } from './component/comment/comment-query.service';
import { TopicCommentService } from './component/comment/topic-comment.service';
import { CommentVotingService } from './component/voting/comment-voting.service';
import { UserQueryService } from './component/user/user-query.service';
import { TopicVotingService } from './component/voting/topic-voting.service';
import { VotingQueryService } from './component/voting/voting-query.service';
import { CategoryVotingService } from './component/voting/category-voting.service';
import { GroupVotingService } from './component/voting/group-voting.service';
import { GroupQueryService } from './component/group/group-query.service';
import { GroupService } from './component/group/group.service';
import { GroupCommentService } from './component/comment/group-comment.service';
import { GroupReferenceService } from './component/reference/group-reference.service';
import { TopicProgressService } from './component/progress/topic-progress.service';
import { ProgressQueryService } from './component/progress/progress-query.service';
import { GroupProgressService } from './component/progress/group-progress.service';
import { PathCommentService } from './component/comment/path-comment.service';
import { PathQueryService } from './component/path/path-query.service';
import { PathService } from './component/path/path.service';
import { PathVotingService } from './component/voting/path-voting.service';
import { PathProgressService } from './component/progress/path-progress.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({ onSameUrlNavigation: 'reload' })),
    importProvidersFrom(HttpClientModule),

    importProvidersFrom(LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      colorScheme: ['purple', 'teal', 'orange', 'gray', 'red', 'red', 'red']
    })),

    { provide: AuthenticationService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocalStorageService },
    { provide: EventBusService },
    { provide: UserQueryService },

    // CATEGORY
    { provide: CategoryService },
    { provide: CategoryQueryService },

    // TOPIC
    { provide: TopicService },
    { provide: TopicQueryService },

    // GROUP
    { provide: GroupQueryService },
    { provide: GroupService },

    // PATH
    { provide: PathQueryService },
    { provide: PathService },

    // REFERENCE
    { provide: ReferenceQueryService },
    { provide: TopicReferenceService },
    { provide: GroupReferenceService },

    // COMMENT
    { provide: CommentQueryService },
    { provide: TopicCommentService },
    { provide: GroupCommentService },
    { provide: PathCommentService },

    // VOTING
    { provide: VotingQueryService },
    { provide: ReferenceVotingService },
    { provide: CommentVotingService },
    { provide: TopicVotingService },
    { provide: CategoryVotingService },
    { provide: GroupVotingService },
    { provide: PathVotingService },

    // PROGRESS
    { provide: ProgressQueryService },
    { provide: TopicProgressService },
    { provide: GroupProgressService },
    { provide: PathProgressService },

  ]
};

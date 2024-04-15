import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../shared/service/event-bus.service';
import { AbstractProgressService } from './abstract-progress.service';
import { ProgressType } from './progress.model';
import { ProgressSetedEvent } from './progress-module.event';
import { DomainObjectType } from '../voting/vote.model';

@Injectable()
export class TopicProgressService extends AbstractProgressService {
  _http: HttpClient = inject(HttpClient);
  _authenticationService = inject(AuthenticationService);
  _eventBus = inject(EventBusService);
  logger = inject(NGXLogger);

  resourceName: string = "topics";
  resourcePath: string = "/api/v1/" + this.resourceName;
  _url: string = "http://localhost:9006" + this.resourcePath;
  _domainObjectType: DomainObjectType = DomainObjectType.TOPIC;

  authenticationService(): AuthenticationService {
    return this._authenticationService;
  }
  eventBus(): EventBusService {
    return this._eventBus;
  }
  http(): HttpClient {
    return this._http;
  }
  url(): string {
    return this._url;
  }
  domainObjectType(): DomainObjectType {
    return this._domainObjectType;
  }
}

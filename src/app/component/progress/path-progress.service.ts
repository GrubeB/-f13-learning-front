import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../auth/authentication.service';
import { EventBusService } from '../../shared/service/event-bus.service';
import { AbstractProgressService } from './abstract-progress.service';
import { DomainObjectType } from '../voting/vote.model';

@Injectable()
export class PathProgressService extends AbstractProgressService {
  _http: HttpClient = inject(HttpClient);
  _authenticationService = inject(AuthenticationService);
  _eventBus = inject(EventBusService);

  resourceName: string = "paths";
  resourcePath: string = "/api/v1/" + this.resourceName;
  _url: string = "http://localhost:9006" + this.resourcePath;
  _domainObjectType: DomainObjectType = DomainObjectType.PATH;

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

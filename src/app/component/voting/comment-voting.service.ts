import { Injectable, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AbstractVotingService } from './abstract-voting.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { EventBusService } from '../../shared/service/event-bus.service';
import { DomainObjectType } from './vote.model';

@Injectable()
export class CommentVotingService extends AbstractVotingService {
  _http: HttpClient = inject(HttpClient);
  _authenticationService = inject(AuthenticationService);
  _eventBus = inject(EventBusService);

  resourceName: string = "comments";
  resourcePath: string = "/api/v1/" + this.resourceName;
  _url: string = "http://localhost:9006" + this.resourcePath;
  _domainObjectType: DomainObjectType = DomainObjectType.COMMENT;

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

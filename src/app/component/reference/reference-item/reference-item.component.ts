import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, Input, inject } from '@angular/core';
import { Reference } from '../reference.model';
import { AuthenticationService } from '../../../auth/authentication.service';
import { ReferenceVotingService } from '../reference-voting.service';
import { take } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../service/event-bus.service';
import { ReferenceDislikeRemovedEvent, ReferenceDislikedEvent, ReferenceLikeRemovedEvent, ReferenceLikedEvent } from '../reference-module.event';

@Component({
  selector: 'reference-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './reference-item.component.html',
  styleUrl: './reference-item.component.scss'
})
export class ReferenceItemComponent {
  authenticationService = inject(AuthenticationService);
  referenceVotingService= inject(ReferenceVotingService);
  eventBus= inject(EventBusService);
  logger = inject(NGXLogger);

  @Input() reference!: Reference;

  openReference(): void {
    this.logger.debug(ReferenceItemComponent.name, " openReference()");
    window.open(this.reference.link, '_blank');
  }

  addLike(referenceId: string){
    this.logger.debug(ReferenceItemComponent.name, " addLike()");
    this.authenticationService.authenticationContext$().pipe(take(1)).subscribe({
      next: context => {
        if(context!=null && context.user.id != null) {
          const userId = context.user.id;
          this.referenceVotingService.createLike(referenceId, userId).subscribe({
            next: res =>{
              this.logger.debug(ReferenceItemComponent.name, " User give like ");
              this.eventBus.emit(ReferenceLikedEvent.name, new ReferenceLikedEvent(referenceId, userId));
            }
          });
        }
      }
    });
  }

  addDislike(referenceId: string){
    this.logger.debug(ReferenceItemComponent.name, " addDislike()");
    this.authenticationService.authenticationContext$().pipe(take(1)).subscribe({
      next: context => {
        if(context!=null && context.user.id != null) {
          const userId = context.user.id;
          this.referenceVotingService.createDislike(referenceId, userId).subscribe({
            next: res =>{
              this.logger.debug(ReferenceItemComponent.name, " User give dislike ");
              this.eventBus.emit(ReferenceDislikedEvent.name, new ReferenceDislikedEvent(referenceId, userId));
            }
          });
        }
      }
    });
  }
  removeLikeAndDislike(referenceId: string){
    this.logger.debug(ReferenceItemComponent.name, " removeLikeAndDislike()");
    this.authenticationService.authenticationContext$().pipe(take(1)).subscribe({
      next: context => {
        if(context!=null && context.user.id != null) {
          const userId = context.user.id;

          this.referenceVotingService.deleteLike(referenceId, userId).subscribe({
            next: res =>{
              this.logger.debug(ReferenceItemComponent.name, " User removed like ");
              this.eventBus.emit(ReferenceLikeRemovedEvent.name, new ReferenceLikeRemovedEvent(referenceId, userId));
            }
          });
          this.referenceVotingService.deleteDislike(referenceId, userId).subscribe({
            next: res =>{
              this.logger.debug(ReferenceItemComponent.name, " User removed dislike ");
              this.eventBus.emit(ReferenceDislikeRemovedEvent.name, new ReferenceDislikeRemovedEvent(referenceId, userId));
            }
          });
        }
      }
    });
  }
}

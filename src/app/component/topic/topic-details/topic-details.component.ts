import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../../service/topic.service';
import { take } from 'rxjs';
import { ReferenceItemComponent } from '../../reference/reference-item/reference-item.component';
import { TopicDetailsReferencesFilterComponent } from '../topic-details-references-filter/topic-details-references-filter.component';
import { filters, sorters } from '../topic-details-references-filter/topic-details-references-filter.component';
import { EventBusService } from '../../../service/event-bus.service';
import { TopicDetailsFilterChangedEvent } from '../topic-module.event';
import { ReferenceCreateFormComponent } from '../../reference/reference-create-form/reference-create-form.component';
import { TopicQueryService } from '../../../service/topic-query.service';
import { NGXLogger } from 'ngx-logger';
import { ReferenceCreatedEvent, ReferenceDislikeRemovedEvent, ReferenceDislikedEvent, ReferenceLikeRemovedEvent, ReferenceLikedEvent } from '../../reference/reference-module.event';

@Component({
  selector: 'topic-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReferenceItemComponent,
    TopicDetailsReferencesFilterComponent,
    ReferenceCreateFormComponent
  ],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.scss'
})
export class TopicDetailsComponent implements OnInit {
  topicService = inject(TopicService);
  topicQueryService = inject(TopicQueryService);
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);

  @Input() topicId!: string;

  topic?: Topic;
  activeFilter: any = filters[0];
  activeSorter: any = sorters[0];

  ngOnInit(): void {
    this.getTopic(this.topicId);
    this.eventBus.listen(TopicDetailsFilterChangedEvent.name, (e: TopicDetailsFilterChangedEvent) => {
      this.activeFilter = filters[e.filterIndex];
      this.activeSorter = sorters[e.sorterIndex];
    });
    this.eventBus.listen(ReferenceCreatedEvent.name, (e: ReferenceCreatedEvent) => {
      this.refreshTopic(); 
      this.toggleReferenceForm();
    });
    this.eventBus.listen(ReferenceLikedEvent.name, (e: ReferenceLikedEvent) => {
      this.refreshTopic(); 
    });
    this.eventBus.listen(ReferenceDislikedEvent.name, (e: ReferenceDislikedEvent) => {
      this.refreshTopic(); 
    });
    
    this.eventBus.listen(ReferenceLikeRemovedEvent.name, (e: ReferenceLikeRemovedEvent) => {
      this.refreshTopic(); 
    });
    
    this.eventBus.listen(ReferenceDislikeRemovedEvent.name, (e: ReferenceDislikeRemovedEvent) => {
      this.refreshTopic(); 
    });
  }

  getTopic(id: string): void {
    this.logger.debug(TopicDetailsComponent.name, "getTopic()");
    this.topicQueryService.get(id).pipe(take(1)).subscribe({
      next: data => {
        this.topic = data;
        this.logger.debug(TopicDetailsComponent.name,"topic: ",  this.topic);
      },
      error: e => {
      }
    });
  }
  refreshTopic() {
    this.logger.debug(TopicDetailsComponent.name, "refreshTopic()");
    if(this.topic?.id) {
      this.getTopic(this.topic?.id);
    }
  }
  // REFERENCE FORM
  referenceFormViable: boolean = false;
  toggleReferenceForm() {
    this.logger.debug(TopicDetailsComponent.name, "toggleReferenceForm()");
    this.referenceFormViable = !this.referenceFormViable;
  }
}

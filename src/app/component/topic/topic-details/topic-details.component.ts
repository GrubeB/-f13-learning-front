import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Reference, Topic } from '../../../model/topic.model';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../../service/topic.service';
import { take } from 'rxjs';
import { ReferenceItemComponent } from '../../reference/reference-item/reference-item.component';
import { TopicDetailsReferencesFilterComponent } from '../topic-details-references-filter/topic-details-references-filter.component';
import { filters, sorters } from '../topic-details-references-filter/topic-details-references-filter.component';
import { EventBusService } from '../../../service/event-bus.service';
import { TopicDetailsFilterChangedEvent } from '../topic-module.event';

@Component({
  selector: 'topic-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReferenceItemComponent,
    TopicDetailsReferencesFilterComponent
  ],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.scss'
})
export class TopicDetailsComponent implements OnInit {
  @Input() topicId!: string;
  topic?: Topic;
  activeFilter: any = filters[0];
  activeSorter: any = sorters[0];

  constructor(
    private topicService: TopicService,
    private eventBus: EventBusService
  ) { }

  ngOnInit(): void {
    this.getTopic(this.topicId);
    this.eventBus.listen(TopicDetailsFilterChangedEvent.name, (e: TopicDetailsFilterChangedEvent) => {
      this.activeFilter = filters[e.filterIndex];
      this.activeSorter = sorters[e.sorterIndex];
    })
  }

  getTopic(id: string): void {
    this.topicService.get(id).pipe(take(1)).subscribe({
      next: data => {
        this.topic = data;
      },
      error: e => {
      }
    });
  }
}

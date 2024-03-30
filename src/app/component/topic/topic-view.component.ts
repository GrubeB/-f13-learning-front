import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Topic } from '../../model/topic.model';
import { TopicService } from '../../service/topic.service';
import { take } from 'rxjs';
import { TopicsListComponent } from './topics-list/topics-list.component';
import { TopicDetailsModalComponent } from './topic-details-modal/topic-details-modal.component';
import { EventBusService } from '../../service/event-bus.service';
import { HideTopicDetailsModalEvent, ShowTopicDetailsModalEvent } from './topic-module.event';


@Component({
  selector: 'topic-view',
  standalone: true,
  imports: [
    CommonModule,
    TopicsListComponent,
    TopicDetailsModalComponent
  ],
  templateUrl: './topic-view.component.html',
  styleUrl: './topic-view.component.scss'
})
export class TopicViewComponent implements OnInit {
  topics: Topic[] = [];

  constructor(
    private topicService: TopicService,
    private eventBus: EventBusService
    ) { }

  ngOnInit(): void {
    this.getTopics();
  }
  getTopics() {
    this.topicService.getAll().pipe(take(1)).subscribe({
      next: data => {
        this.topics = data.content;
      },
      error: e => {
        this.topics = [];
      }
    });
  }
}

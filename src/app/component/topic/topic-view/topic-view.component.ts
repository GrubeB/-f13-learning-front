import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Topic } from '../topic.model';
import { TopicService } from '../topic.service';
import { first, take } from 'rxjs';
import { TopicListComponent } from '../topic-list/topic-list.component';
import { TopicDetailsModalComponent } from '../topic-details-modal/topic-details-modal.component';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { CreateTopicEvent, DeleteTopicEvent, TopicCreatedEvent, TopicDeletedEvent, TopicUpdateddEvent, UpdateTopicEvent } from '../topic-module.event';
import { TopicQueryService } from '../topic-query.service';
import { NGXLogger } from 'ngx-logger';
import { TopicFormComponent } from '../topic-form/topic-form.component';
import { Vote } from '../../voting/vote.model';


@Component({
  selector: 'topic-view',
  standalone: true,
  imports: [
    CommonModule,
    TopicListComponent,
    TopicDetailsModalComponent,
    TopicFormComponent
  ],
  templateUrl: './topic-view.component.html',
  styleUrl: './topic-view.component.scss'
})
export class TopicViewComponent implements OnInit {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  topicQueryService = inject(TopicQueryService);
  topicService = inject(TopicService);
  
  topics: Topic[] = [];

  constructor() {
    this.eventBus.listen([
      TopicCreatedEvent.name,
      TopicUpdateddEvent.name,
      TopicDeletedEvent.name
    ], (e: any) => {
      this.getTopics();
      this.changeTab('list');
    });
    this.eventBus.listen([
      UpdateTopicEvent.name,
      CreateTopicEvent.name
    ], (event: any) => {
      this.changeTab('form');
    });
    this.eventBus.listen(DeleteTopicEvent.name, (event: DeleteTopicEvent) => {
      this.topicService.delete(event.topicId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(TopicViewComponent.name, " Deleted Topic ", event.topicId);
          this.eventBus.emit(TopicDeletedEvent.name, new TopicDeletedEvent(event.topicId));
        },
        error: e => {
          this.logger.debug(TopicViewComponent.name, " Error occured while deleting topic ", e);
        }
      });
    });
  }
  ngOnInit(): void {
    this.getTopics();
  }
  getTopics() {
    this.logger.debug(TopicViewComponent.name, " getTopics()");
    this.topicQueryService.getAll().pipe(first()).subscribe({
      next: data => {
        this.topics = data.content;
      },
      error: e => {
        this.topics = [];
      }
    });
  }
  
  showTopicForm() {
    this.logger.debug(TopicViewComponent.name, " toggleTopicForm()");
    this.eventBus.emit(CreateTopicEvent.name, new CreateTopicEvent());
  }

  // TABS
  tabs = [Tabs.LIST, Tabs.FORM];
  activeTab = this.tabs[0];
  changeTab(tabName: string) {
    this.logger.debug(TopicViewComponent.name, "changeTab()");
    var tab : Tabs = Tabs[tabName as keyof typeof Tabs];
    if (tab && this.tabs.includes(tab)) {
      let index = this.tabs.indexOf(tab);
      this.activeTab = this.tabs[index];
    }
  };
}
enum Tabs {
  LIST = "LIST",
  FORM = "FORM",
}

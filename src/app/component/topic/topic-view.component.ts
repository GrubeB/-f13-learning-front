import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Topic } from '../../model/topic.model';
import { TopicService } from '../../service/topic.service';
import { take } from 'rxjs';
import { TopicsListComponent } from './topics-list/topics-list.component';


@Component({
  selector: 'topic-view',
  standalone: true,
  imports: [
    CommonModule,
    TopicsListComponent
  ],
  templateUrl: './topic-view.component.html',
  styleUrl: './topic-view.component.css'
})
export class TopicViewComponent {
  topics: Topic[] = [];

  constructor(private topicService: TopicService) { }

  ngOnInit(): void {
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
